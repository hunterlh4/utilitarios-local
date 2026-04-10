import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetActressDetail } from './hooks/useGetActressDetail.hook';
import { useGetAllActressAdult } from './hooks/useGetAllActressAdult.hook';
import { useUpdateActressAdult } from './hooks/useUpdateActressAdult.hook';
import { useCreateVideo } from './hooks/useCreateVideo.hook';
import { useUpdateVideo } from './hooks/useUpdateVideo.hook';
import { useDeleteVideo } from './hooks/useDeleteVideo.hook';
import { useUpdateVideoStatus } from './hooks/useUpdateVideoStatus.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { useUpdateLinks } from './hooks/useUpdateLinks.hook';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Upload, Check, Eye, Edit, Link as LinkIcon, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { EditActressDialog } from './components/EditActressDialog';
import { AddVideoDialog } from './components/AddVideoDialog';
import { EditVideoDialog } from './components/EditVideoDialog';
import type { VideoAdult } from './models/actressAdult.model';

export const ActressAdultDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const actressId = parseInt(id || '0');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [editVideoDialogOpen, setEditVideoDialogOpen] = useState(false);
  const [editingActress, setEditingActress] = useState<number | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoAdult | null>(null);
  const [showCompleted, setShowCompleted] = useState(() => {
    const saved = localStorage.getItem('actress-adult-show-completed');
    return saved === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [editingLinks, setEditingLinks] = useState(false);
  const [linksInput, setLinksInput] = useState<string[]>([]);

  const { data: actressDetail, isLoading: isLoadingDetail } = useGetActressDetail(actressId);
  const { data: actresses } = useGetAllActressAdult();
  const updateActress = useUpdateActressAdult();
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();
  const updateVideoStatus = useUpdateVideoStatus();
  const uploadImage = useUploadImage();
  const updateLinks = useUpdateLinks();

  const videos = actressDetail?.videos || [];

  const handleEditActress = async (
    id: number,
    name: string,
    tagIds: number[],
    newImage: File | null
  ) => {
    try {
      await updateActress.mutateAsync({ id, name, tagIds });

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

  const handleOpenEdit = (id: number) => {
    setEditingActress(id);
    setEditDialogOpen(true);
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

  const handleDeleteVideo = async (videoId: number) => {
    if (!confirm('¿Estás seguro de eliminar este video?')) return;
    
    try {
      await deleteVideo.mutateAsync(videoId);
      toast.success('Video eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar video:', error);
      toast.error('Error al eliminar el video');
    }
  };

  const handleOpenEditVideo = (video: VideoAdult) => {
    setEditingVideo(video);
    setEditVideoDialogOpen(true);
  };

  const handleToggleVideoStatus = async (videoId: number, currentStatus: number) => {
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
    try {
      await updateLinks.mutateAsync({ id: actressId, links: linksInput.filter(l => l.trim()) });
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

  if (isLoadingDetail) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!actressDetail) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Actriz no encontrada</p>
        <Button onClick={() => navigate('/ver/actress-adult')} className="mt-4">Volver a actrices</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/ver/actress-adult')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{actressDetail.name}</h1>
      </div>

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
            <Button
              onClick={() => handleOpenEdit(actressId)}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          {/* Links Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p 
                className="text-sm font-medium flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={!editingLinks ? handleStartEditLinks : undefined}
              >
                <LinkIcon className="h-4 w-4" />
                Links
              </p>
              {editingLinks && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveLinks} className="bg-green-600 hover:bg-green-700">
                    Guardar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingLinks(false)}>
                    Cancelar
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
                  + Agregar Link
                </Button>
              </div>
            ) : actressDetail.links.length > 0 ? (
              <div className="space-y-1">
                {actressDetail.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline block truncate"
                  >
                    {link.url}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin links</p>
            )}
          </div>
        </div>
      )}

      {/* Videos Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Videos ({filteredVideos.length})</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowCompleted(!showCompleted);
                localStorage.setItem('actress-adult-show-completed', String(!showCompleted));
              }}
              size="icon"
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {showCompleted ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setVideoDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Agregar Video
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Buscar videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          {availableTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedTagFilters.includes(tag)
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

        {/* Videos Grid */}
        <div className="grid gap-4">
          {filteredVideos && filteredVideos.length > 0 ? (
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
                      onClick={() => handleOpenEditVideo(video)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      X
                    </Button>
                    <Button
                      size="icon"
                      className="h-6 w-6 bg-green-600 hover:bg-green-700"
                      onClick={() => handleToggleVideoStatus(video.id, video.status || 0)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Sin videos</p>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <EditActressDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        actressId={editingActress}
        onSave={handleEditActress}
      />

      <AddVideoDialog
        open={videoDialogOpen}
        onOpenChange={setVideoDialogOpen}
        currentActressId={actressId}
        actresses={actresses || []}
        onSave={handleAddVideo}
      />

      {editingVideo && (
        <EditVideoDialog
          open={editVideoDialogOpen}
          onOpenChange={setEditVideoDialogOpen}
          video={editingVideo}
          actresses={actresses || []}
          onSave={handleEditVideo}
        />
      )}
    </div>
  );
};
