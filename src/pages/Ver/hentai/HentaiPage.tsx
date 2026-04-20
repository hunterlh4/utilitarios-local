import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnimeSearch } from '../anime/hooks/useAnimeSearch.hook';
import { useGetAllHentai } from './hooks/useGetAllHentai.hook';
import { useAddHentai } from './hooks/useAddHentai.hook';
import { useUpdateHentaiStatus } from './hooks/useUpdateHentaiStatus.hook';
import { useUpdateHentaiTags } from './hooks/useUpdateHentaiTags.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { useExportHentai } from './hooks/useExportHentai.hook';
import { useImportHentai } from './hooks/useImportHentai.hook';
import type { Hentai } from './models/hentai.model';
import { useGetTags } from '@/common/hooks/useGetTags.hook';
import { TagType } from '@/common/enums/tag-type.enum';
import { ContentStatus } from '@/common/enums/ver.enum';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Spinner } from '@/common/components/ui/spinner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Search, Check, Clock, Upload, Download, Database, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { downloadBase64File } from '@/common/lib/download-file';

export const HentaiPage = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [searchMode, setSearchMode] = useState<'saved' | 'remote'>('saved');
  const [remoteTypeFilter, setRemoteTypeFilter] = useState<'all' | 'ova'>('all');
  const [filterStatus, setFilterStatus] = useState<ContentStatus>(ContentStatus.Pending);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [hoveredHentaiId, setHoveredHentaiId] = useState<number | null>(null);
  const [pendingReplace, setPendingReplace] = useState<{ file: File; refId: number } | null>(null);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [hentaiForTagEdit, setHentaiForTagEdit] = useState<Hentai | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedLetterFilter, setSelectedLetterFilter] = useState<string>('');
  const importInputRef = useRef<HTMLInputElement>(null);
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
    clearSearch,
  } =
    useAnimeSearch({ isHentai: true, type: remoteTypeFilter === 'ova' ? 'ova' : undefined });

  const { data: savedHentai, isLoading: isLoadingSaved, error, refetch } = useGetAllHentai();
  const addHentai = useAddHentai();
  const updateStatus = useUpdateHentaiStatus();
  const updateHentaiTags = useUpdateHentaiTags();
  const uploadImage = useUploadImage();
  const exportHentai = useExportHentai();
  const importHentai = useImportHentai();
  const { data: tags, isLoading: isLoadingTags } = useGetTags(TagType.Hentai);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const file = await exportHentai.mutateAsync();
      downloadBase64File(file.base64, file.fileName || 'hentai.xlsx');
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
      await importHentai.mutateAsync(file);
      await refetch();
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  };

  const uploadPastedImage = useCallback(async (file: File, refId: number) => {
    try {
      await uploadImage.mutateAsync({ file, refId });
      await refetch();
    } catch (error) {
      console.error('Error:', error);
    }
  }, [refetch, uploadImage]);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!hoveredHentaiId) return;

    const hoveredHentai = savedHentai?.find((hentai) => hentai.id === hoveredHentaiId);
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        if (hoveredHentai?.image) {
          setPendingReplace({ file: blob, refId: hoveredHentaiId });
          return;
        }

        await uploadPastedImage(blob, hoveredHentaiId);
        break;
      }
    }
  }, [hoveredHentaiId, savedHentai, uploadPastedImage]);

  useEffect(() => {
    const pasteListener = (event: Event) => {
      void handlePaste(event as ClipboardEvent);
    };

    document.addEventListener('paste', pasteListener);
    return () => {
      document.removeEventListener('paste', pasteListener);
    };
  }, [handlePaste]);

  useEffect(() => {
    if (searchMode !== 'remote') {
      setShowResults(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      void handleSearch();
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [handleSearch, searchMode, searchQuery, setShowResults]);

  const toggleFilter = () => {
    setShowResults(false);
    setFilterStatus(prev => 
      prev === ContentStatus.Pending ? ContentStatus.Completed : ContentStatus.Pending
    );
  };

  const toggleSearchMode = () => {
    setSearchMode(prev => (prev === 'saved' ? 'remote' : 'saved'));
    setSelectedTagFilters([]);
    setSelectedLetterFilter('');
    setRemoteTypeFilter('all');
    clearSearch();
  };

  const availableTags = useMemo(() => {
    if (!savedHentai) return [];
    const tagSet = new Set<string>();
    savedHentai.forEach((hentai) => {
      hentai.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [savedHentai]);

  const filteredSavedHentai = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const letter = selectedLetterFilter.toLowerCase();
    return (savedHentai ?? []).filter((hentai) =>
      hentai.status === filterStatus
      && (!query || hentai.title.toLowerCase().includes(query))
      && (!letter || hentai.title.toLowerCase().startsWith(letter))
      && (selectedTagFilters.length === 0 || selectedTagFilters.every((filterTag) => hentai.tags?.includes(filterTag)))
    );
  }, [filterStatus, savedHentai, searchQuery, selectedLetterFilter, selectedTagFilters]);

  const toggleTagFilter = (tagName: string) => {
    setSelectedTagFilters((prev) => (
      prev.includes(tagName)
        ? prev.filter((tag) => tag !== tagName)
        : [...prev, tagName]
    ));
  };

  const isRemoteAllMode = searchMode === 'remote' && !searchQuery.trim();

  const handleClearFilters = () => {
    setSelectedTagFilters([]);
    setSelectedLetterFilter('');
    setRemoteTypeFilter('all');
    setSearchQuery('');
  };

  const mapTagNamesToIds = useCallback((tagNames: string[] | undefined) => {
    if (!tags || !tagNames || tagNames.length === 0) return [];

    const normalized = new Set(tagNames.map((tag) => tag.toLowerCase()));
    return tags
      .filter((tag) => normalized.has(tag.name.toLowerCase()))
      .map((tag) => tag.id);
  }, [tags]);

  const handleOpenTagsDialog = (hentai: Hentai) => {
    setHentaiForTagEdit(hentai);
    setSelectedTagIds(mapTagNamesToIds(hentai.tags));
    setTagDialogOpen(true);
  };

  useEffect(() => {
    if (!tagDialogOpen || !hentaiForTagEdit) return;
    setSelectedTagIds(mapTagNamesToIds(hentaiForTagEdit.tags));
  }, [hentaiForTagEdit, mapTagNamesToIds, tagDialogOpen]);

  const toggleDialogTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSaveTags = async () => {
    if (!hentaiForTagEdit) return;

    try {
      await updateHentaiTags.mutateAsync({ id: hentaiForTagEdit.id, tagIds: selectedTagIds });
      toast.success('Tags actualizados correctamente');
      setTagDialogOpen(false);
      setHentaiForTagEdit(null);
    } catch (error) {
      console.error('Error al actualizar tags:', error);
      toast.error('Error al actualizar tags');
    }
  };

  const handleSaveHentai = async (anime: (typeof searchResults)[0]) => {
    try {
      await addHentai.mutateAsync({
        apiId: anime.mal_id.toString(),
        title: anime.title,
        image: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
        episodes: anime.episodes || 0,
        status: ContentStatus.Pending,
      });
      toast.success('Hentai guardado correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar el hentai');
    }
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (searchMode === 'remote') {
      await handleSearch(event);
    }
  };

  const handleToggleStatus = async (hentai: Hentai) => {
    const newStatus = hentai.status === ContentStatus.Pending
      ? ContentStatus.Completed
      : ContentStatus.Pending;

    try {
      await updateStatus.mutateAsync({ id: hentai.id, status: newStatus });
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-0.5 p-1">
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
              placeholder={searchMode === 'saved' ? 'Filtrar hentai guardado...' : 'Buscar hentai...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={toggleSearchMode}
            aria-label={searchMode === 'saved' ? 'Cambiar a búsqueda remota' : 'Cambiar a búsqueda local'}
          >
            {searchMode === 'saved' ? <Database className="h-4 w-4" /> : <Search className="h-4 w-4" />}
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

        {searchMode === 'remote' && showResults && (
          <div>
            <div className="bg-muted/30 rounded-md p-1.5 mb-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="text-xs font-medium mr-1">Tipo:</p>
                <Button
                  type="button"
                  variant={remoteTypeFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 rounded-full px-2 text-xs"
                  onClick={() => setRemoteTypeFilter('all')}
                >
                  Todos
                </Button>
                <Button
                  type="button"
                  variant={remoteTypeFilter === 'ova' ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 rounded-full px-2 text-xs"
                  onClick={() => setRemoteTypeFilter((prev) => (prev === 'ova' ? 'all' : 'ova'))}
                >
                  OVA
                </Button>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">
              {isRemoteAllMode ? `Catálogo hentai (${searchResults.length})` : `Resultados de búsqueda (${searchResults.length})`}
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
                      <CardHeader className="p-0 cursor-pointer" onClick={() => handleSaveHentai(anime)}>
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
                {!isRemoteAllMode ? (
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
                ) : (
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Se cargó todo el catálogo disponible para este filtro.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No se encontraron resultados</p>
            )}
          </div>
        )}

        {searchMode === 'remote' && !showResults && (
          <p className="text-center text-muted-foreground py-8">
            Escribe para buscar en la API y espera 2.5 segundos sin teclear. Si dejas el campo vacío, se carga todo el catálogo hentai disponible para el filtro.
          </p>
        )}

        {searchMode === 'saved' && (
          <div>
            <div className="bg-muted/30 rounded-md p-1.5 mb-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="text-xs font-medium mr-1">Letra:</p>
                {alphabet.map((letter) => {
                  const isActive = selectedLetterFilter === letter;
                  return (
                    <Button
                      key={letter}
                      type="button"
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      className="h-6 rounded-full px-2 text-xs"
                      onClick={() => setSelectedLetterFilter((prev) => (prev === letter ? '' : letter))}
                    >
                      {letter}
                    </Button>
                  );
                })}
                {selectedLetterFilter && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setSelectedLetterFilter('')}
                  >
                    Quitar letra
                  </Button>
                )}
              </div>
            </div>
            {availableTags.length > 0 && (
              <div className="bg-muted/30 rounded-md p-1.5 mb-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-xs font-medium mr-1">Tags:</p>
                  {availableTags.map((tag) => {
                    const isActive = selectedTagFilters.includes(tag);
                    return (
                      <Button
                        key={tag}
                        type="button"
                        variant={isActive ? 'default' : 'outline'}
                        size="sm"
                        className="h-6 rounded-full px-2 text-xs"
                        onClick={() => toggleTagFilter(tag)}
                      >
                        {tag}
                      </Button>
                    );
                  })}
                  {(selectedTagFilters.length > 0 || searchQuery.trim()) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={handleClearFilters}
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>
            )}
            <h2 className="text-xl font-semibold mb-4">
            </h2>
            {isLoadingSaved ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Error al cargar la colección</p>
              </div>
            ) : filteredSavedHentai.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
                {filteredSavedHentai.map((hentai) => (
                  <Card
                    key={hentai.id}
                    className="overflow-hidden flex flex-col border-0 shadow-none rounded-none"
                    onMouseEnter={() => setHoveredHentaiId(hentai.id)}
                    onMouseLeave={() => setHoveredHentaiId(null)}
                  >
                    <CardHeader
                      className="p-0 cursor-pointer"
                      onClick={() => handleToggleStatus(hentai)}
                    >
                      <div className="aspect-2/3 w-full overflow-hidden bg-muted relative">
                        {hentai.image ? (
                          <img
                            src={hentai.image}
                            alt={hentai.title}
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-2">
                      <CardTitle
                        className="text-sm line-clamp-2 text-center cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTagsDialog(hentai);
                        }}
                      >
                        {hentai.title}
                      </CardTitle>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No tienes hentai {filterStatus === ContentStatus.Pending ? 'próximamente' : 'completados'}
              </p>
            )}
          </div>
        )}

        <Dialog open={!!pendingReplace} onOpenChange={(open) => !open && setPendingReplace(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reemplazar imagen</DialogTitle>
            </DialogHeader>
            <p>Este hentai ya tiene imagen. ¿Deseas reemplazarla?</p>
            <DialogFooter>
              <Button variant="outline" className="focus-visible:ring-0 focus-visible:ring-offset-0" onClick={() => setPendingReplace(null)}>
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  if (!pendingReplace) return;
                  await uploadPastedImage(pendingReplace.file, pendingReplace.refId);
                  setPendingReplace(null);
                }}
              >
                Reemplazar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={tagDialogOpen} onOpenChange={(open) => {
          setTagDialogOpen(open);
          if (!open) setHentaiForTagEdit(null);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignar tags</DialogTitle>
            </DialogHeader>
            {isLoadingTags ? (
              <div className="flex justify-center py-4">
                <Spinner className="h-6 w-6" />
              </div>
            ) : tags && tags.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {hentaiForTagEdit?.title}
                </p>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded p-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() => toggleDialogTag(tag.id)}
                      className={`p-2 rounded cursor-pointer text-sm transition-colors ${
                        selectedTagIds.includes(tag.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay tags de tipo hentai.</p>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setTagDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveTags} disabled={updateHentaiTags.isPending}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
