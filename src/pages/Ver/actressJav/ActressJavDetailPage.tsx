import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJavsByActress } from './hooks/useGetJavsByActress.hook';
import { useGetAllActresses } from './hooks/useGetAllActresses.hook';
import { useUpdateJavStatus } from './hooks/useUpdateJavStatus.hook';
import { useDeleteJav } from './hooks/useDeleteJav.hook';
import { useUpdateActress } from './hooks/useUpdateActress.hook';
import { useUpdateActressLinks } from './hooks/useUpdateActressLinks.hook';
import { useAddJav } from '../jav/hooks/useAddJav.hook';
import { useUpdateJav } from '../jav/hooks/useUpdateJav.hook';
import { useUploadJavImage } from '../jav/hooks/useUploadJavImage.hook';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { ContentStatus } from '@/common/enums/ver.enum';
import { toast } from 'sonner';
import { Search, ArrowLeft, Eye, Check, Edit, Trash2, Link as LinkIcon, Plus } from 'lucide-react';
import { ActressDialog } from './components/form';
import { ActressLinksDialog } from './components/ActressLinksDialog';
import { JavDialog } from '../jav/components/form';
import type { JavSummary } from './models/jav-summary.model';
import type { ActressJav } from './models/actress.model';
import type { Jav } from '../jav/models/jav.model';

type ActressDialogSubmit = Partial<ActressJav> & { name: string; tagIds?: number[] };
type JavWithIds = Jav & { actressIds?: number[]; tagIds?: number[] };

export const ActressJavDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const actressId = parseInt(id || '0');

  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [javDialogOpen, setJavDialogOpen] = useState(false);
  const [editingJav, setEditingJav] = useState<Jav | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [linksDialogOpen, setLinksDialogOpen] = useState(false);
  const [editingActress, setEditingActress] = useState<ActressJav | null>(null);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [hoveredJavId, setHoveredJavId] = useState<number | null>(null);
  const [pendingReplace, setPendingReplace] = useState<{ file: File; refId: number } | null>(null);

  const { data: javs, isLoading, error } = useGetJavsByActress(actressId);
  const { data: actresses } = useGetAllActresses();
  const updateJavStatus = useUpdateJavStatus();
  const deleteJav = useDeleteJav();
  const addJav = useAddJav();
  const updateJav = useUpdateJav();
  const updateActress = useUpdateActress();
  const updateActressLinks = useUpdateActressLinks();
  const uploadJavImage = useUploadJavImage();

  const uploadPastedImage = useCallback(async (file: File, refId: number) => {
    try {
      await uploadJavImage.mutateAsync({ file, refId });
      toast.success('Imagen actualizada correctamente');
    } catch {
      toast.error('Error al subir la imagen');
    }
  }, [uploadJavImage]);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!hoveredJavId) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;
        setPendingReplace({ file: blob, refId: hoveredJavId });
        break;
      }
    }
  }, [hoveredJavId]);

  useEffect(() => {
    const listener = (e: Event) => void handlePaste(e as ClipboardEvent);
    document.addEventListener('paste', listener);
    return () => document.removeEventListener('paste', listener);
  }, [handlePaste]);

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

  const mapSummaryToJav = (jav: JavSummary): Jav => ({
    id: jav.id,
    code: jav.code,
    image: jav.image,
    status: jav.status,
    tags: jav.tags || [],
    links: (jav.links || []).map((url) => ({ id: 0, url })),
    actresses: (jav.actresses || []).map((a) => ({ id: a.id, name: a.name, links: [] })),
  });

  const handleEditJav = (jav: JavSummary) => {
    setEditingJav(mapSummaryToJav(jav));
    setJavDialogOpen(true);
  };

  const handleOpenCreateJav = () => {
    setEditingJav(null);
    setJavDialogOpen(true);
  };

  const handleSaveJav = async (jav: Jav) => {
    try {
      const javPayload = jav as JavWithIds;
      const linksUrls = jav.links.map((link) => link.url);
      const actressIds = javPayload.actressIds || [];
      const tagIds = javPayload.tagIds || [];

      if (editingJav) {
        await updateJav.mutateAsync({
          id: jav.id,
          data: {
            code: jav.code,
            actressIds,
            tagIds,
            image: jav.image,
            links: linksUrls,
          },
        });
      } else {
        await addJav.mutateAsync({
          code: jav.code,
          actressIds,
          tagIds,
          image: jav.image,
          links: linksUrls,
        });
      }

      setJavDialogOpen(false);
      setEditingJav(null);
    } catch (error) {
      console.error('Error al guardar JAV:', error);
    }
  };

  const handleOpenEditActress = () => {
    if (!actress) return;
    setEditingActress(actress);
    setEditDialogOpen(true);
  };

  const handleOpenEditLinks = () => {
    if (!actress) return;
    setLinksDialogOpen(true);
  };

  const handleSaveActress = async (actressData: ActressDialogSubmit) => {
    if (!editingActress) return;

    try {
      await updateActress.mutateAsync({
        id: editingActress.id,
        data: {
          name: actressData.name,
          tagIds: actressData.tagIds || [],
        },
      });
      setEditDialogOpen(false);
      setEditingActress(null);
    } catch (error) {
      console.error('Error al actualizar actriz:', error);
    }
  };

  const handleSaveLinks = async (id: number, links: string[]) => {
    try {
      await updateActressLinks.mutateAsync({ id, links });
      setLinksDialogOpen(false);
    } catch (error) {
      console.error('Error al actualizar enlaces:', error);
    }
  };

  const toggleTagFilter = (tagName: string) => {
    setSelectedTagFilters(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const handleClearFilters = () => {
    setSelectedTagFilters([]);
    setSearchQuery('');
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
    <div className="h-full overflow-y-auto flex flex-col gap-3">
      <div className="flex flex-col gap-3 px-1 pt-1">
        <div className="flex gap-2 flex-wrap items-center">
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
            onClick={handleOpenCreateJav}
            size="icon"
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleOpenEditActress}
            size="icon"
            variant="outline"
            disabled={!actress}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleOpenEditLinks}
            size="icon"
            variant="outline"
            disabled={!actress}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        {availableTags.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-2">
            <p className="text-xs font-medium mb-1.5">Filtrar por tags:</p>
            <div className="flex flex-wrap items-center gap-1.5">
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
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearFilters}
                disabled={selectedTagFilters.length === 0 && searchQuery.trim().length === 0}
                className="h-7 px-2 text-xs"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="px-1 pb-1">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error al cargar los JAVs</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-x-0 gap-y-1">
            {filteredJavs.map((jav: JavSummary) => (
              <div key={jav.id}
                onMouseEnter={() => setHoveredJavId(jav.id)}
                onMouseLeave={() => setHoveredJavId(null)}
              >
                <div className="relative w-full overflow-hidden bg-muted group aspect-3/2">
                  <img src={jav.image} alt={jav.code} className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <Button
                      size="icon"
                      className="h-6 w-6 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleEditJav(jav)}
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
                          const isSinCensura = urlLower.includes('decensored') || urlLower.includes('uncensored');
                          const isSpanish = urlLower.includes('español') || urlLower.includes('spanish');

                          let colorClass = 'text-blue-500 hover:text-blue-600';
                          if (isSinCensura) {
                            colorClass = 'text-red-500 hover:text-red-600';
                          } else if (isSpanish) {
                            colorClass = 'text-green-500 hover:text-green-600';
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
        )}

        {filteredJavs.length === 0 && !isLoading && !error && (
          <p className="text-center text-muted-foreground py-8">
            {searchQuery || selectedTagFilters.length > 0
              ? 'No se encontraron JAVs con los filtros aplicados'
              : `No hay JAVs ${showCompleted ? 'completados' : 'por ver'} de esta actriz`}
          </p>
        )}
      </div>

      <ActressDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editingActress={editingActress}
        onSave={handleSaveActress}
      />

      <JavDialog
        open={javDialogOpen}
        onOpenChange={setJavDialogOpen}
        onSave={handleSaveJav}
        editingJav={editingJav}
        preselectedActressId={actressId}
      />

      <ActressLinksDialog
        key={`${actress?.id ?? actressId}-${linksDialogOpen ? 'open' : 'closed'}`}
        open={linksDialogOpen}
        onOpenChange={setLinksDialogOpen}
        actress={actress ?? null}
        onSave={handleSaveLinks}
      />

      <Dialog open={!!pendingReplace} onOpenChange={(open) => !open && setPendingReplace(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reemplazar imagen</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Este JAV ya tiene imagen. ¿Deseas reemplazarla?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingReplace(null)}>Cancelar</Button>
            <Button onClick={async () => {
              if (!pendingReplace) return;
              await uploadPastedImage(pendingReplace.file, pendingReplace.refId);
              setPendingReplace(null);
            }}>
              Reemplazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
