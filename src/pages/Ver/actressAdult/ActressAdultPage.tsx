import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllActressAdult } from './hooks/useGetAllActressAdult.hook';
import { useCreateActressAdult } from './hooks/useCreateActressAdult.hook';
// import { useDeleteActressAdult } from './hooks/useDeleteActressAdult.hook';
import { useUpdateActressAdult } from './hooks/useUpdateActressAdult.hook';
import { useCreateVideo } from './hooks/useCreateVideo.hook';
import { useUpdateVideo } from './hooks/useUpdateVideo.hook';
import { useDeleteVideo } from './hooks/useDeleteVideo.hook';
import { useGetActressDetail } from './hooks/useGetActressDetail.hook';
import { useUpdateVideoStatus } from './hooks/useUpdateVideoStatus.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { useDeleteMedia } from './hooks/useDeleteMedia.hook';
import { useUpdateLinks } from './hooks/useUpdateLinks.hook';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Plus, Trash2, Check, Eye, Edit, Search, Link as LinkIcon, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { CreateActressDialog } from './components/CreateActressDialog';
import { EditActressDialog } from './components/EditActressDialog';
import { AddVideoDialog } from './components/AddVideoDialog';
import { EditVideoDialog } from './components/EditVideoDialog';
import { BulkCreateActressDialog } from './components/BulkCreateActressDialog';
import type { VideoAdult } from './models/actressAdult.model';

export const ActressAdultPage = () => {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkCreateDialogOpen, setBulkCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [editVideoDialogOpen, setEditVideoDialogOpen] = useState(false);
  const [selectedActress, setSelectedActress] = useState<number | null>(null);
  const [editingActress, setEditingActress] = useState<number | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoAdult | null>(null);
  const [showCompleted, setShowCompleted] = useState(() => {
    const saved = localStorage.getItem('actress-adult-show-completed');
    return saved === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [actressSearchQuery, setActressSearchQuery] = useState('');
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [selectedActressTagFilters, setSelectedActressTagFilters] = useState<string[]>([]);
  const [editingLinks, setEditingLinks] = useState(false);
  const [linksInput, setLinksInput] = useState<string[]>([]);
  const [hoveredActressId, setHoveredActressId] = useState<number | null>(null);

  const { data: actresses, isLoading } = useGetAllActressAdult();
  const createActress = useCreateActressAdult();
  const updateActress = useUpdateActressAdult();
  // const deleteActress = useDeleteActressAdult();
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();
  const { data: actressDetail, isLoading: isLoadingDetail } = useGetActressDetail(selectedActress);
  const updateVideoStatus = useUpdateVideoStatus();
  const uploadImage = useUploadImage();
  const deleteMedia = useDeleteMedia();
  const updateLinks = useUpdateLinks();

  // Manejar paste global
  const handlePaste = async (e: ClipboardEvent) => {
    // No hacer nada si hay algún dialog abierto
    if (createDialogOpen || editDialogOpen || videoDialogOpen || editVideoDialogOpen) {
      return;
    }

    const items = e.clipboardData?.items;
    if (!items) return;

    // Manejo de imágenes cuando hay actriz hover activa
    if (hoveredActressId && !selectedActress) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (!blob) continue;

          try {
            await uploadImage.mutateAsync({
              file: blob,
              refId: hoveredActressId,
            });
            toast.success('Imagen subida correctamente');
          } catch (error) {
            console.error('Error:', error);
            toast.error('Error al subir la imagen');
          }
          return;
        }
      }
    }

    // Manejo de texto (nombres de actrices)
    if (items[0].kind === 'string' && items[0].type === 'text/plain') {
      items[0].getAsString(async (text) => {
        const name = text.trim();
        if (!name) return;

        // Verificar si la actriz ya existe
        const existingActress = actresses?.find(a => a.name.toLowerCase() === name.toLowerCase());
        
        if (existingActress) {
          // Si existe, navegar al detalle
          navigate(`/ver/actress-adult/${existingActress.id}`);
          toast.success(`Actriz "${name}" seleccionada`);
        } else {
          // Si no existe, crear una nueva (sin ir al detalle)
          try {
            await createActress.mutateAsync({ name, tagIds: [] });
            toast.success(`Actriz "${name}" creada correctamente`);
          } catch (error) {
            console.error('Error al crear actriz:', error);
            toast.error('Error al crear la actriz');
          }
        }
      });
    }
  };

  // Agregar y remover listener de paste
  useEffect(() => {
    document.addEventListener('paste', handlePaste as any);
    return () => {
      document.removeEventListener('paste', handlePaste as any);
    };
  }, [hoveredActressId, selectedActress, navigate, actresses, createActress, createDialogOpen, editDialogOpen, videoDialogOpen, editVideoDialogOpen]);

  const videos = actressDetail?.videos || [];

  const handleCreateActress = async (name: string, image: File | null, tagIds: number[]) => {
    try {
      const result = await createActress.mutateAsync({ name, tagIds });
      
      if (image && result.id) {
        try {
          await uploadImage.mutateAsync({ file: image, refId: result.id });
          toast.success('Actriz creada e imagen subida correctamente');
        } catch (uploadError) {
          console.error('Error al subir imagen:', uploadError);
          toast.error('Actriz creada pero error al subir la imagen');
        }
      } else {
        toast.success('Actriz creada correctamente');
      }
      
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error al crear actriz:', error);
      toast.error('Error al crear la actriz');
    }
  };

  const handleBulkCreateActresses = async (names: string[]) => {
    try {
      for (const name of names) {
        try {
          await createActress.mutateAsync({ name, tagIds: [] });
        } catch (error) {
          console.error(`Error al crear actriz "${name}":`, error);
          toast.error(`Error al crear la actriz "${name}"`);
        }
      }
      toast.success('Actrices creadas correctamente');
      setBulkCreateDialogOpen(false);
    } catch (error) {
      console.error('Error en creación en lote:', error);
      toast.error('Error al crear las actrices');
    }
  };

  const handleEditActress = async (
    id: number,
    name: string,
    tagIds: number[],
    newImage: File | null,
    imagesToDelete: number[]
  ) => {
    try {
      await updateActress.mutateAsync({ id, name, tagIds });

      if (imagesToDelete.length > 0) {
        for (const mediaId of imagesToDelete) {
          try {
            await deleteMedia.mutateAsync(mediaId);
          } catch (error) {
            console.error('Error al eliminar imagen:', error);
          }
        }
      }

      if (newImage) {
        try {
          await uploadImage.mutateAsync({ file: newImage, refId: id });
        } catch (uploadError) {
          console.error('Error al subir imagen:', uploadError);
          toast.error('Actriz actualizada pero error al subir la imagen');
          setEditDialogOpen(false);
          setEditingActress(null);
          return;
        }
      }

      toast.success('Actriz actualizada correctamente');
      setEditDialogOpen(false);
      setEditingActress(null);
    } catch (error) {
      console.error('Error al actualizar actriz:', error);
      toast.error('Error al actualizar la actriz');
    }
  };

  const handleOpenEdit = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingActress(id);
    setEditDialogOpen(true);
  };

  const handleSelectActress = (id: number) => {
    navigate(`/ver/actress-adult/${id}`);
  };

  const handleAddVideo = async (source: string, videoUrl: string, actressIds: number[], tagIds: number[]) => {
    try {
      await createVideo.mutateAsync({ source, videoUrl, actressIds, tagIds });
      toast.success('Video agregado correctamente');
      setVideoDialogOpen(false);
    } catch (error) {
      console.error('Error al agregar video:', error);
      toast.error('Error al agregar el video');
    }
  };

  const handleEditVideo = async (videoId: number, actressIds: number[], tagIds: number[]) => {
    try {
      await updateVideo.mutateAsync({ videoId, actressIds, tagIds });
      toast.success('Video actualizado correctamente');
      setEditVideoDialogOpen(false);
      setEditingVideo(null);
    } catch (error) {
      console.error('Error al actualizar video:', error);
      toast.error('Error al actualizar el video');
    }
  };

  const handleDeleteVideo = async (videoId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('¿Estás seguro de eliminar este video?')) return;
    
    try {
      await deleteVideo.mutateAsync(videoId);
      toast.success('Video eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar video:', error);
      toast.error('Error al eliminar el video');
    }
  };

  const handleOpenEditVideo = (video: VideoAdult, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingVideo(video);
    setEditVideoDialogOpen(true);
  };

  const handleToggleVideoStatus = async (videoId: number, currentStatus: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const newStatus = currentStatus === 0 ? 1 : 0;
      await updateVideoStatus.mutateAsync({ id: videoId, status: newStatus });
      toast.success(newStatus === 1 ? 'Video marcado como completado' : 'Video marcado como por ver');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const handleStartEditLinks = () => {
    setLinksInput(actressDetail?.links.map(l => l.url) || []);
    setEditingLinks(true);
  };

  const handleSaveLinks = async () => {
    if (!selectedActress) return;
    try {
      await updateLinks.mutateAsync({ id: selectedActress, links: linksInput.filter(l => l.trim()) });
      toast.success('Links actualizados correctamente');
      setEditingLinks(false);
    } catch (error) {
      console.error('Error al actualizar links:', error);
      toast.error('Error al actualizar los links');
    }
  };

  const handleAddLink = () => {
    setLinksInput([...linksInput, '']);
  };

  const handleRemoveLink = (index: number) => {
    setLinksInput(linksInput.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...linksInput];
    newLinks[index] = value;
    setLinksInput(newLinks);
  };

  const selectedActressData = actresses?.find((a) => a.id === selectedActress);

  const toggleActressTagFilter = (tagName: string) => {
    setSelectedActressTagFilters(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const availableActressTags = useMemo(() => {
    if (!actresses) return [];
    const tagSet = new Set<string>();
    actresses.forEach(actress => {
      actress.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [actresses]);

  const filteredActresses = useMemo(() => {
    if (!actresses) return [];

    return actresses.filter((actress) => {
      const matchesSearch =
        actress.name.toLowerCase().includes(actressSearchQuery.toLowerCase());

      const matchesTags = selectedActressTagFilters.length === 0 ||
        selectedActressTagFilters.every(filterTag => actress.tags?.includes(filterTag));

      return matchesSearch && matchesTags;
    });
  }, [actresses, actressSearchQuery, selectedActressTagFilters]);

  const toggleTagFilter = (tagName: string) => {
    setSelectedTagFilters(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const filteredVideos = useMemo(() => {
    if (!videos) return [];

    let result = videos.filter((video) => {
      if (video.status === undefined || video.status === null) return true;
      return showCompleted ? video.status === 1 : video.status === 0;
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(video =>
        video.title?.toLowerCase().includes(query) ||
        video.actresses.some(a => a.name.toLowerCase().includes(query)) ||
        video.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    if (selectedTagFilters.length > 0) {
      result = result.filter(video =>
        selectedTagFilters.every(filterTag => video.tags?.includes(filterTag))
      );
    }

    return result;
  }, [videos, showCompleted, searchQuery, selectedTagFilters]);

  const availableTags = useMemo(() => {
    if (!videos) return [];
    const tagSet = new Set<string>();
    videos.forEach(video => {
      video.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [videos]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1
          className={`text-3xl font-bold ${selectedActress ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
          onClick={() => selectedActress && setSelectedActress(null)}
        >
          {selectedActressData?.name || 'Actrices Porno'}
        </h1>
        <div className="flex gap-2">
          {selectedActress && (
            <>
              <Button
                onClick={() => handleOpenEdit(selectedActress)}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  const newValue = !showCompleted;
                  setShowCompleted(newValue);
                  localStorage.setItem('actress-adult-show-completed', String(newValue));
                }}
                size="icon"
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                {showCompleted ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </>
          )}
          {selectedActress ? (
            <Button
              onClick={() => setVideoDialogOpen(true)}
              disabled={createVideo.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Agregar Video
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => setCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Actriz
              </Button>
              <Button onClick={() => setBulkCreateDialogOpen(true)} variant="outline">
                Importar actrices
              </Button>
            </div>
          )}
        </div>
      </div>

      {!selectedActress && (
        <div className="space-y-4">
          {/* Buscador y filtros de actrices */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar actriz..."
                value={actressSearchQuery}
                onChange={(e) => setActressSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {availableActressTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableActressTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleActressTagFilter(tag)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedActressTagFilters.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lista de actrices */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : filteredActresses && filteredActresses.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
              {filteredActresses.map((actress) => (
                <div
                  key={actress.id}
                  className="relative w-full cursor-pointer transition-all hover:opacity-90 group"
                  style={{ paddingBottom: '150%' }}
                  onClick={() => handleSelectActress(actress.id)}
                  onMouseEnter={() => setHoveredActressId(actress.id)}
                  onMouseLeave={() => setHoveredActressId(null)}
                >
                  <Button
                    size="icon"
                    className="absolute top-2 left-2 h-7 w-7 z-10 bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleOpenEdit(actress.id, e)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  {actress.image ? (
                    <img
                      src={actress.image}
                      alt={actress.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                    <p 
                      className="font-medium text-sm text-white text-center truncate cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(actress.name);
                        toast.success('Nombre copiado al portapapeles');
                      }}
                    >
                      {actress.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {actresses && actresses.length > 0 ? 'Sin resultados' : 'No hay actrices creadas'}
            </p>
          )}
        </div>
      )}

      {selectedActress && (
        <div className="space-y-4">
          {/* Información de la actriz */}
          {actressDetail && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                {actressDetail.image && (
                  <img
                    src={actressDetail.image}
                    alt={actressDetail.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{actressDetail.name}</h2>
                  {actressDetail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {actressDetail.tags.map((tag, idx) => (
                        <span key={idx} className="bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Links
                  </p>
                  {!editingLinks ? (
                    <Button size="sm" variant="outline" onClick={handleStartEditLinks}>
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingLinks(false)}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSaveLinks}>
                        Guardar
                      </Button>
                    </div>
                  )}
                </div>

                {editingLinks ? (
                  <div className="space-y-2">
                    {linksInput.map((link, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={link}
                          onChange={(e) => handleLinkChange(idx, e.target.value)}
                          placeholder="https://..."
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleRemoveLink(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={handleAddLink}>
                      <Plus className="h-3 w-3 mr-1" />
                      Agregar Link
                    </Button>
                  </div>
                ) : actressDetail.links.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {actressDetail.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {link.url}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay links</p>
                )}
              </div>
            </div>
          )}

          {/* Buscador y filtros */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, actriz o tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {availableTags.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Filtrar por tags:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <div
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                        selectedTagFilters.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lista de videos */}
          {isLoadingDetail ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : filteredVideos && filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((video) => (
                <div key={video.id} className="relative w-full group" style={{ paddingBottom: '56.25%' }}>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0"
                  >
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title || 'Video'}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted rounded">
                        <span className="text-4xl">🎬</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      {video.source}
                    </div>
                    {video.actresses && video.actresses.length > 1 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 rounded-b">
                        <p className="text-xs text-white text-center truncate">
                          {video.actresses.map(a => a.name).join(', ')}
                        </p>
                      </div>
                    )}
                    {video.tags && video.tags.length > 0 && (
                      <div className="absolute top-10 left-2 flex flex-wrap gap-1">
                        {video.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="bg-purple-500/80 text-white text-xs px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                        {video.tags.length > 3 && (
                          <span className="bg-purple-500/80 text-white text-xs px-2 py-0.5 rounded">
                            +{video.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </a>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      className="h-6 w-6 bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => handleOpenEditVideo(video, e)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      onClick={(e) => handleDeleteVideo(video.id, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-6 w-6 bg-green-600 hover:bg-green-700"
                      onClick={(e) => handleToggleVideoStatus(video.id, video.status || 0, e)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {searchQuery || selectedTagFilters.length > 0
                ? 'No se encontraron videos con los filtros aplicados'
                : `No hay videos ${showCompleted ? 'completados' : 'por ver'}`}
            </p>
          )}
        </div>
      )}

      <CreateActressDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleCreateActress}
      />

      <BulkCreateActressDialog
        open={bulkCreateDialogOpen}
        onOpenChange={setBulkCreateDialogOpen}
        onCreateActresses={handleBulkCreateActresses}
      />

      <EditActressDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        actressId={editingActress}
        onSave={handleEditActress}
      />

      {selectedActress && actresses && (
        <>
          <AddVideoDialog
            open={videoDialogOpen}
            onOpenChange={setVideoDialogOpen}
            currentActressId={selectedActress}
            actresses={actresses}
            onSave={handleAddVideo}
          />

          <EditVideoDialog
            open={editVideoDialogOpen}
            onOpenChange={setEditVideoDialogOpen}
            video={editingVideo}
            actresses={actresses}
            onSave={handleEditVideo}
          />
        </>
      )}
    </div>
  );
};
