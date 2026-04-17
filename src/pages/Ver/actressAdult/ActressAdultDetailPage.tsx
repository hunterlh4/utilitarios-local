import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetActressDetail } from './hooks/useGetActressDetail.hook';
import { useGetAllActressAdult } from './hooks/useGetAllActressAdult.hook';
import { useUpdateActressAdult } from './hooks/useUpdateActressAdult.hook';
import { useUpdateLinks } from './hooks/useUpdateLinks.hook';
import { useCreateVideo } from './hooks/useCreateVideo.hook';
import { useUpdateVideo } from './hooks/useUpdateVideo.hook';
import { useDeleteVideo } from './hooks/useDeleteVideo.hook';
import { useUpdateVideoStatus } from './hooks/useUpdateVideoStatus.hook';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { ContentStatus } from '@/common/enums/ver.enum';
import { Search, ArrowLeft, Eye, Check, Edit, Trash2, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { AddVideoDialog } from './components/AddVideoDialog';
import { EditVideoDialog } from './components/EditVideoDialog';
import { EditActressDialog } from './components/EditActressDialog';
import { ActressLinksDialog } from './components/ActressLinksDialog';
import type { VideoAdult } from './models/actressAdult.model';

export const ActressAdultDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const actressId = parseInt(id || '0');

  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [editVideoDialogOpen, setEditVideoDialogOpen] = useState(false);
  const [editActressDialogOpen, setEditActressDialogOpen] = useState(false);
  const [linksDialogOpen, setLinksDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoAdult | null>(null);
  const [editingActressId, setEditingActressId] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);

  const { data: actressDetail, isLoading: isLoadingDetail } = useGetActressDetail(actressId);
  const { data: actresses } = useGetAllActressAdult();
  const updateActress = useUpdateActressAdult();
  const updateLinks = useUpdateLinks();
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();
  const updateVideoStatus = useUpdateVideoStatus();

  const videos = useMemo(() => actressDetail?.videos ?? [], [actressDetail?.videos]);

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

  const handleOpenEditActress = () => {
    setEditingActressId(actressId);
    setEditActressDialogOpen(true);
  };

  const handleOpenEditLinks = () => {
    setLinksDialogOpen(true);
  };

  const handleSaveActress = async (id: number, name: string, tagIds: number[]) => {
    try {
      await updateActress.mutateAsync({ id, name, tagIds });
      setEditActressDialogOpen(false);
      setEditingActressId(null);
    } catch (error) {
      console.error('Error al actualizar actriz:', error);
    }
  };

  const handleSaveLinks = async (actressId: number, links: string[]) => {
    try {
      await updateLinks.mutateAsync({ id: actressId, links });
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
        video.source?.toLowerCase().includes(query) ||
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
    <div className="h-full flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap px-1 pt-1 items-center">
        <Button
          onClick={() => navigate('/ver/actress-adult')}
          size="icon"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={`Buscar videos de ${actressDetail.name}...`}
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
          onClick={() => setVideoDialogOpen(true)}
          size="icon"
          className="bg-green-600 hover:bg-green-700"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleOpenEditActress}
          size="icon"
          variant="outline"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleOpenEditLinks}
          size="icon"
          variant="outline"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {availableTags.length > 0 && (
        <div className="bg-muted/30 rounded-lg p-2 mx-1">
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
      )}

      <div className="flex-1 overflow-y-auto px-1 pb-1">
        <div className="grid grid-cols-4 gap-x-0 gap-y-1">

          {filteredVideos.map((video) => (
            <div key={video.id}>
              <div className="relative w-full overflow-hidden bg-muted group aspect-3/2">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title || video.source || 'Video'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <Button
                    size="icon"
                    className="h-6 w-6 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleOpenEditVideo(video)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-6 w-6 bg-green-600 hover:bg-green-700"
                    onClick={() => handleToggleVideoStatus(video.id, video.status ?? ContentStatus.Pending)}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-6 w-6 bg-red-600 hover:bg-red-700"
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-1 text-center px-0.5">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <p className="font-bold text-sm">{video.source || video.title || 'Video'}</p>
                </div>
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mt-1">
                    {video.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                    {video.tags.length > 3 && (
                      <span className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0.5 rounded">
                        +{video.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                {video.actresses && video.actresses.length > 1 && (
                  <div className="text-sm text-muted-foreground truncate mt-0.5">
                    <span>{video.actresses.map(a => a.name).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {filteredVideos.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Sin videos</p>
        )}
      </div>

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
          currentActressId={actressId}
        />
      )}

      <EditActressDialog
        open={editActressDialogOpen}
        onOpenChange={setEditActressDialogOpen}
        actressId={editingActressId}
        onSave={handleSaveActress}
      />

      <ActressLinksDialog
        key={`${actressDetail.id}-${linksDialogOpen ? 'open' : 'closed'}`}
        open={linksDialogOpen}
        onOpenChange={setLinksDialogOpen}
        actress={actressDetail ?? null}
        onSave={handleSaveLinks}
      />
    </div>
  );
};
