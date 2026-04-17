import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetActressDetail } from './hooks/useGetActressDetail.hook';
import { useGetAllActressAdult } from './hooks/useGetAllActressAdult.hook';
import { useUpdateActressAdult } from './hooks/useUpdateActressAdult.hook';
import { useCreateVideo } from './hooks/useCreateVideo.hook';
import { useUpdateVideo } from './hooks/useUpdateVideo.hook';
import { useDeleteVideo } from './hooks/useDeleteVideo.hook';
import { useUpdateVideoStatus } from './hooks/useUpdateVideoStatus.hook';
import { useUpdateLinks } from './hooks/useUpdateLinks.hook';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { ContentStatus } from '@/common/enums/ver.enum';
import { Upload, Check, Eye, EyeOff, Edit, Link as LinkIcon, X, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
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
  const [showCompleted, setShowCompleted] = useState(false);
  const [showActressCard, setShowActressCard] = useState(false);
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
  const updateLinks = useUpdateLinks();

  const videos = useMemo(() => actressDetail?.videos ?? [], [actressDetail?.videos]);

  const handleEditActress = async (id: number, name: string, tagIds: number[]) => {
    try {
      await updateActress.mutateAsync({ id, name, tagIds });
      setEditDialogOpen(false);
      setEditingActress(null);
    } catch (error) {
      console.error('Error al actualizar actriz:', error);
    }
  };

  const handleOpenEdit = (id: number) => {
    setEditingActress(id);
    setEditDialogOpen(true);
  };

  const handleAddVideo = async (source: string, videoUrl: string, actressIds: number[], tagIds: number[]) => {
    try {
      await createVideo.mutateAsync({ source, videoUrl, actressIds, tagIds });
      setVideoDialogOpen(false);
    } catch (error) {
      console.error('Error al agregar video:', error);
    }
  };

  const handleEditVideo = async (videoId: number, actressIds: number[], tagIds: number[]) => {
    try {
      await updateVideo.mutateAsync({ videoId, actressIds, tagIds });
      setEditVideoDialogOpen(false);
      setEditingVideo(null);
    } catch (error) {
      console.error('Error al actualizar video:', error);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!confirm('¿Estás seguro de eliminar este video?')) return;

    try {
      await deleteVideo.mutateAsync(videoId);
    } catch (error) {
      console.error('Error al eliminar video:', error);
    }
  };

  const handleOpenEditVideo = (video: VideoAdult) => {
    setEditingVideo(video);
    setEditVideoDialogOpen(true);
  };

  const handleToggleVideoStatus = async (videoId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === ContentStatus.Pending
        ? ContentStatus.Completed
        : ContentStatus.Pending;
      await updateVideoStatus.mutateAsync({ id: videoId, status: newStatus });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const handleStartEditLinks = () => {
    setLinksInput(actressDetail?.links.map(l => l.url) || []);
    setEditingLinks(true);
  };

  const handleSaveLinks = async () => {
    try {
      await updateLinks.mutateAsync({ id: actressId, links: linksInput.filter(l => l.trim()) });
      setEditingLinks(false);
    } catch (error) {
      console.error('Error al actualizar links:', error);
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
    let result = videos.filter((video) => {
      if (video.status === undefined || video.status === null) return true;
      return showCompleted
        ? video.status !== ContentStatus.Pending
        : video.status === ContentStatus.Pending;
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
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/ver/actress-adult')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="relative flex-1 min-w-50">
          <Input
            placeholder="Buscar videos..."
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
        <div className="min-w-0 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-2xl font-bold">Videos ({filteredVideos.length})</h2>
            <Button
              onClick={() => setVideoDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Agregar Video
            </Button>
          </div>

          {availableTags.length > 0 && (
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
          )}

          <div className="flex-1 overflow-y-auto pb-1">
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="relative w-full group" style={{ paddingBottom: '56.25%' }}>
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 block"
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
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded" />
                    </a>

                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      {video.source}
                    </div>

                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        className="h-7 w-7 bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleOpenEditVideo(video)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="h-7 w-7 bg-green-600 hover:bg-green-700"
                        onClick={() => handleToggleVideoStatus(video.id, video.status ?? 0)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="h-7 w-7 bg-red-600 hover:bg-red-700"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-2">
                      {video.actresses && video.actresses.length > 1 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 rounded-b">
                          <p className="text-xs text-white text-center truncate">
                            {video.actresses.map(a => a.name).join(', ')}
                          </p>
                        </div>
                      )}
                      {video.tags && video.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {video.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Sin videos</p>
            )}
          </div>
        </div>

        {showActressCard && (
          <div className="px-1 lg:sticky lg:top-3 self-start">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border/60 shadow-sm">
              <div className="flex items-center gap-3">
                {actressDetail.image && (
                  <img
                    src={actressDetail.image}
                    alt={actressDetail.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                {!actressDetail.image && (
                  <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold truncate">{actressDetail.name}</h2>
                  {actressDetail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {actressDetail.tags.map((tag, idx) => (
                        <span key={idx} className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded">
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
          </div>
        )}
      </div>

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
