import { useState } from 'react';
import { useAnimeSearch } from './hooks/useAnimeSearch.hook';
import { useGetAllAnime } from './hooks/useGetAllAnime.hook';
import { useAddAnime } from './hooks/useAddAnime.hook';
import { useUpdateAnimeStatus } from './hooks/useUpdateAnimeStatus.hook';
import { ContentStatus } from '@/common/enums/ver.enum';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Spinner } from '@/common/components/ui/spinner';
import { Search, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const AnimePage = () => {
  const [filterStatus, setFilterStatus] = useState<ContentStatus>(ContentStatus.Pending);
  const { searchQuery, setSearchQuery, searchResults, isSearching, showResults, handleSearch, setShowResults } =
    useAnimeSearch({ isHentai: false });

  const { data: savedAnimes, isLoading: isLoadingSaved, error } = useGetAllAnime();
  const addAnime = useAddAnime();
  const updateStatus = useUpdateAnimeStatus();

  const toggleFilter = () => {
    setShowResults(false);
    setFilterStatus(prev => 
      prev === ContentStatus.Pending ? ContentStatus.Completed : ContentStatus.Pending
    );
  };

  const handleSaveAnime = async (anime: (typeof searchResults)[0]) => {
    try {
      await addAnime.mutateAsync({
        apiId: anime.mal_id.toString(),
        title: anime.title,
        image: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
        episodes: anime.episodes || 0,
        status: ContentStatus.Pending,
      });
      toast.success('Anime guardado correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar el anime');
    }
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Anime</h1>

        {/* Buscador */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Buscar anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={isSearching || !searchQuery.trim()}
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
                {searchResults.map((anime) => (
                  <Card key={anime.mal_id} className="overflow-hidden flex flex-col border-0 shadow-none rounded-none">
                    <CardHeader className="p-0 cursor-pointer" onClick={() => handleSaveAnime(anime)}>
                      <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
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
            ) : (
              <p className="text-center text-muted-foreground py-8">No se encontraron resultados</p>
            )}
          </div>
        )}

        {/* Vista de Animes guardados (Próximamente / Completado) */}
        {!showResults && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {filterStatus === ContentStatus.Pending ? 'Próximamente' : 'Completado'}
            </h2>
            {isLoadingSaved ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Error al cargar los animes</p>
              </div>
            ) : savedAnimes && savedAnimes.filter(a => a.status === filterStatus).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
                {savedAnimes
                  .filter(anime => anime.status === filterStatus)
                  .map((anime) => (
                    <Card key={anime.id} className="overflow-hidden flex flex-col border-0 shadow-none rounded-none">
                      <CardHeader 
                        className="p-0 cursor-pointer" 
                        onClick={() => handleToggleStatus(anime.id, anime.status)}
                      >
                        <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
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
                No tienes animes {filterStatus === ContentStatus.Pending ? 'próximamente' : 'completados'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
