import { useCallback, useEffect, useRef, useState } from 'react';
import { useAnimeSearch } from './hooks/useAnimeSearch.hook';
import { useGetAllAnime } from './hooks/useGetAllAnime.hook';
import { useAddAnime } from './hooks/useAddAnime.hook';
import { useDeleteAnime } from './hooks/useDeleteAnime.hook';
import { useUpdateAnimeStatus } from './hooks/useUpdateAnimeStatus.hook';
import { useExportAnime } from './hooks/useExportAnime.hook';
import { useImportAnime } from './hooks/useImportAnime.hook';
import { ContentStatus } from '@/common/enums/ver.enum';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Spinner } from '@/common/components/ui/spinner';
import { Search, Check, Clock, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { downloadBase64File } from '@/common/lib/download-file';

export const AnimePage = () => {
  const [filterStatus, setFilterStatus] = useState<ContentStatus>(ContentStatus.Pending);
  const [isApiSearchMode, setIsApiSearchMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [hoveredSavedAnimeId, setHoveredSavedAnimeId] = useState<number | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const rightClickGuardRef = useRef<{ animeId: number; expiresAt: number } | null>(null);
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    handleSearch,
    setShowResults,
    currentPage,
    hasNextPage,
    goToNextPage,
    goToPrevPage,
  } =
    useAnimeSearch({ isHentai: false });

  const { data: savedAnimes, isLoading: isLoadingSaved, error, refetch } = useGetAllAnime();
  const addAnime = useAddAnime();
  const deleteAnime = useDeleteAnime();
  const updateStatus = useUpdateAnimeStatus();
  const exportAnime = useExportAnime();
  const importAnime = useImportAnime();
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredSavedAnimes = (savedAnimes ?? [])
    .filter((anime) => anime.status === filterStatus)
    .filter((anime) => {
      if (isApiSearchMode || !normalizedSearchQuery) return true;
      return (
        anime.title.toLowerCase().includes(normalizedSearchQuery) ||
        anime.apiId.toString().includes(normalizedSearchQuery)
      );
    });

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const file = await exportAnime.mutateAsync();
      downloadBase64File(file.base64, file.fileName || 'anime.xlsx');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importAnime.mutateAsync(file);
      await refetch();
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  };

  const toggleFilter = () => {
    setShowResults(false);
    setFilterStatus(prev => 
      prev === ContentStatus.Pending ? ContentStatus.Completed : ContentStatus.Pending
    );
  };

  const toggleSearchMode = () => {
    setIsApiSearchMode((prev) => {
      const next = !prev;
      if (!next) {
        setShowResults(false);
      }
      return next;
    });
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (!isApiSearchMode) {
      setShowResults(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isApiSearchMode) {
      setShowResults(false);
      return;
    }

    if (!searchQuery.trim()) {
      return;
    }

    await handleSearch();
  };

  const isRightClickGuardActive = (animeId: number) => {
    const guard = rightClickGuardRef.current;

    if (!guard) return false;

    if (Date.now() > guard.expiresAt) {
      rightClickGuardRef.current = null;
      return false;
    }

    return guard.animeId === animeId;
  };

  const handleSaveAnime = async (anime: (typeof searchResults)[0], status: ContentStatus) => {
  
      await addAnime.mutateAsync({
        apiId: anime.mal_id.toString(),
        title: anime.title,
        image: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
        episodes: anime.episodes || 0,
        status,
      });
    
   
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === ContentStatus.Pending 
      ? ContentStatus.Completed 
      : ContentStatus.Pending;
    
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDeleteAnime = useCallback(async (id: number) => {
    try {
      await deleteAnime.mutateAsync(id);
      toast.success('Anime eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar anime:', error);
    }
  }, [deleteAnime]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Delete') return;
      if (event.repeat) return;
      if (showResults) return;
      if (hoveredSavedAnimeId === null) return;

      const target = event.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      event.preventDefault();
      void handleDeleteAnime(hoveredSavedAnimeId);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleDeleteAnime, hoveredSavedAnimeId, showResults]);

  return (
    <div className="space-y-6">
      <div>

        {/* Buscador */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6">
          <input
            ref={importInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImportExcel}
          />
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Buscar anime..."
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            type="button"
            size="icon"
            onClick={toggleSearchMode}
            disabled={isSearching}
            className={isApiSearchMode ? 'bg-orange-600 hover:bg-orange-700 text-white' : undefined}
            title={isApiSearchMode ? 'Búsqueda por API activa' : 'Filtro local activo'}
          >
            {isSearching ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
          <Button 
            type="button" 
            size="icon" 
            onClick={toggleFilter}
          >
            {filterStatus === ContentStatus.Pending ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleImportClick}
            disabled={isExporting || isImporting}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleExportExcel}
            disabled={isExporting || isImporting}
          >
            <Download className="h-4 w-4" />
          </Button>
        </form>

        {/* Vista de Resultados de búsqueda */}
        {showResults && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Resultados de búsqueda ({searchResults.length})
            </h2>
            {isSearching ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
                  {searchResults.map((anime) => (
                    <Card key={anime.mal_id} className="overflow-hidden flex flex-col border-0 shadow-none rounded-none">
                      <CardHeader
                        className="p-0 cursor-pointer"
                        onClick={() => {
                          if (isRightClickGuardActive(anime.mal_id)) return;
                          void handleSaveAnime(anime, ContentStatus.Pending);
                        }}
                        onContextMenu={(event) => {
                          event.preventDefault();
                          rightClickGuardRef.current = {
                            animeId: anime.mal_id,
                            expiresAt: Date.now() + 500,
                          };
                          void handleSaveAnime(anime, ContentStatus.Completed);
                        }}
                      >
                        <div className="aspect-2/3 w-full overflow-hidden bg-muted">
                          <img
                            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                            alt={anime.title}
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-2">
                        <CardTitle className="text-sm line-clamp-2 text-center">{anime.title}</CardTitle>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={isSearching || currentPage <= 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">Página {currentPage}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={isSearching || !hasNextPage}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No se encontraron resultados</p>
            )}
          </div>
        )}

        {/* Vista de Animes guardados (Próximamente / Completado) */}
        {!showResults && (
          <div>
            {/* <h2 className="text-xl font-semibold mb-4">
              {filterStatus === ContentStatus.Pending ? 'Próximamente' : 'Completado'}
            </h2> */}
            {isLoadingSaved ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Error al cargar los animes</p>
              </div>
            ) : filteredSavedAnimes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
                {filteredSavedAnimes.map((anime) => (
                    <Card
                      key={anime.id}
                      className="overflow-hidden flex flex-col border-0 shadow-none rounded-none"
                      onMouseEnter={() => setHoveredSavedAnimeId(anime.id)}
                      onMouseLeave={() => setHoveredSavedAnimeId((prev) => (prev === anime.id ? null : prev))}
                    >
                      <CardHeader 
                        className="p-0 cursor-pointer" 
                        onClick={() => handleToggleStatus(anime.id, anime.status)}
                      >
                        <div className="aspect-2/3 overflow-hidden bg-muted">
                          <img 
                            src={anime.image} 
                            alt={anime.title} 
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity" 
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-2">
                        <CardTitle className="text-sm line-clamp-2 text-center">{anime.title}</CardTitle>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {normalizedSearchQuery && !isApiSearchMode
                  ? 'No se encontraron animes con ese filtro'
                  : `No tienes animes ${filterStatus === ContentStatus.Pending ? 'próximamente' : 'completados'}`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
