import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJavsByActress } from './hooks/useGetJavsByActress.hook';
import { useGetAllActresses } from './hooks/useGetAllActresses.hook';
import { useUpdateJavStatus } from './hooks/useUpdateJavStatus.hook';
import { useDeleteJav } from './hooks/useDeleteJav.hook';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { ContentStatus } from '@/common/enums/ver.enum';
import { Search, ArrowLeft, Eye, EyeOff, Check, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import type { JavSummary } from './models/jav-summary.model';

export const ActressJavDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const actressId = parseInt(id || '0');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showActressCard, setShowActressCard] = useState(false);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);

  const { data: javs, isLoading, error } = useGetJavsByActress(actressId);
  const { data: actresses } = useGetAllActresses();
  const updateJavStatus = useUpdateJavStatus();
  const deleteJav = useDeleteJav();

  const actress = actresses?.find(a => a.id === actressId);

  const handleToggleStatus = async (javId: number, currentStatus: ContentStatus) => {
    try {
      const newStatus = currentStatus === ContentStatus.Pending
        ? ContentStatus.Completed
        : ContentStatus.Pending;

      await updateJavStatus.mutateAsync({ id: javId, status: newStatus });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteJav = async (javId: number) => {
    if (!confirm('¿Estás seguro de eliminar este JAV?')) {
      return;
    }

    try {
      await deleteJav.mutateAsync(javId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditJav = (javId: number) => {
    navigate(`/ver/jav?edit=${javId}`);
  };

  const toggleTagFilter = (tagName: string) => {
    setSelectedTagFilters(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const availableTags = useMemo(() => {
    if (!javs) return [];
    const tagSet = new Set<string>();
    javs.forEach((jav: JavSummary) => {
      jav.tags?.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [javs]);

  const filteredJavs = useMemo(() => {
    if (!javs) return [];

    return javs.filter((jav: JavSummary) => {
      const matchesSearch = jav.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = showCompleted
        ? jav.status !== ContentStatus.Pending
        : jav.status === ContentStatus.Pending;

      const matchesTags = selectedTagFilters.length === 0 ||
        selectedTagFilters.every(filterTag => jav.tags?.includes(filterTag));

      return matchesSearch && matchesStatus && matchesTags;
    });
  }, [javs, searchQuery, showCompleted, selectedTagFilters]);

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap px-1 pt-1 items-center">
        <Button
          onClick={() => navigate('/ver/actress-jav')}
          size="icon"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={`Buscar JAVs de ${actress?.name || 'actriz'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          onClick={() => setShowCompleted(!showCompleted)}
          size="icon"
          className="bg-cyan-500 hover:bg-cyan-600"
        >
          {showCompleted ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          onClick={() => setShowActressCard(!showActressCard)}
          size="icon"
          variant="outline"
          className="ml-auto"
        >
          {showActressCard ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] flex-1 min-h-0">
        <div className="min-w-0 flex flex-col gap-3 overflow-hidden">
          {availableTags.length > 0 && (
            <div className="px-1">
              <div className="bg-muted/30 rounded-lg p-2">
                <p className="text-xs font-medium mb-1.5">Filtrar por tags:</p>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <div
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
                      className={`px-2 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                        selectedTagFilters.includes(tag)
                          ? 'bg-purple-500 text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                {selectedTagFilters.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedTagFilters([])}
                    className="mt-1.5 h-6 text-xs"
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-1 pb-1">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Error al cargar los JAVs</p>
              </div>
            ) : filteredJavs && filteredJavs.length > 0 ? (
              <div className="grid grid-cols-4 gap-x-0 gap-y-1">
                {filteredJavs.map((jav: JavSummary) => (
                  <div key={jav.id}>
                    <div className="relative w-full overflow-hidden bg-muted group aspect-3/2">
                      <img src={jav.image} alt={jav.code} className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <Button
                          size="icon"
                          className="h-6 w-6 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleEditJav(jav.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-6 w-6 bg-green-600 hover:bg-green-700"
                          onClick={() => handleToggleStatus(jav.id, jav.status)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-6 w-6 bg-red-600 hover:bg-red-700"
                          onClick={() => handleDeleteJav(jav.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-1 text-center px-0.5">
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        <p className="font-bold text-sm">{jav.code}</p>
                        {jav.links && jav.links.length > 0 && (
                          <span className="flex gap-1.5">
                            {jav.links.map((link: string, index: number) => {
                              const urlLower = link.toLowerCase();
                              const isSinCensura = urlLower.includes("decensored") || urlLower.includes("uncensored");
                              const isSpanish = urlLower.includes("español") || urlLower.includes("spanish");

                              let colorClass = "text-blue-500 hover:text-blue-600";
                              if (isSinCensura) {
                                colorClass = "text-red-500 hover:text-red-600";
                              } else if (isSpanish) {
                                colorClass = "text-green-500 hover:text-green-600";
                              }

                              return (
                                <a
                                  key={index}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-sm underline font-medium ${colorClass}`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  [{index + 1}]
                                </a>
                              );
                            })}
                          </span>
                        )}
                      </div>
                      {jav.tags && jav.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center mt-1">
                          {jav.tags.slice(0, 3).map((tag: string, idx: number) => (
                            <span key={idx} className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {jav.tags.length > 3 && (
                            <span className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0.5 rounded">
                              +{jav.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      {jav.actresses && jav.actresses.length > 1 && (
                        <div className="text-sm text-muted-foreground truncate mt-0.5">
                          <span>{jav.actresses.map((a: { name: string }) => a.name).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery || selectedTagFilters.length > 0
                  ? 'No se encontraron JAVs con los filtros aplicados'
                  : `No hay JAVs ${showCompleted ? 'completados' : 'por ver'} de esta actriz`}
              </p>
            )}
          </div>
        </div>

        {showActressCard && actress && (
          <div className="px-1 lg:sticky lg:top-3 self-start">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border/60 shadow-sm">
              <div className="flex items-center gap-3">
                {actress.image && (
                  <img
                    src={actress.image}
                    alt={actress.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                {!actress.image && (
                  <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold truncate">{actress.name}</h2>
                  {actress.tags && actress.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {actress.tags.map((tag, idx) => (
                        <span key={idx} className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {actress.links && actress.links.length > 0 && (
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {actress.links.map((link, index) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:text-blue-600 underline font-medium"
                        >
                          [{index + 1}]
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
