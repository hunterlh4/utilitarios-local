import { useState } from 'react';
import { useGetAllActressAdult } from './hooks/useGetAllActressAdult.hook';
import { useCreateActressAdult } from './hooks/useCreateActressAdult.hook';
import { useDeleteActressAdult } from './hooks/useDeleteActressAdult.hook';
import { useCreateVideo } from './hooks/useCreateVideo.hook';
import { useGetVideos } from './hooks/useGetVideos.hook';
import { useUpdateVideoStatus } from './hooks/useUpdateVideoStatus.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { Button } from '@/common/components/ui/button';
import { Spinner } from '@/common/components/ui/spinner';
import { Plus, Upload, Trash2, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { CreateActressDialog } from './components/CreateActressDialog';
import { AddVideoDialog } from './components/AddVideoDialog';

export const ActressAdultPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedActress, setSelectedActress] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const { data: actresses, isLoading } = useGetAllActressAdult();
  const createActress = useCreateActressAdult();
  const deleteActress = useDeleteActressAdult();
  const createVideo = useCreateVideo();
  const { data: videos, isLoading: isLoadingVideos } = useGetVideos(selectedActress);
  const updateVideoStatus = useUpdateVideoStatus();
  const uploadImage = useUploadImage();

  const handleCreateActress = async (name: string, image: File | null) => {
    try {
      const result = await createActress.mutateAsync(name);
      
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

  const handleDeleteActress = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteActress.mutateAsync(id);
      toast.success('Actriz eliminada correctamente');
      if (selectedActress === id) {
        setSelectedActress(null);
      }
    } catch (error) {
      console.error('Error al eliminar actriz:', error);
      toast.error('Error al eliminar la actriz');
    }
  };

  const handleSelectActress = (id: number) => {
    setSelectedActress(id);
  };

  const handleAddVideo = async (source: string, videoUrl: string, actressIds: number[]) => {
    try {
      await createVideo.mutateAsync({ source, videoUrl, actressIds });
      toast.success('Video agregado correctamente');
      setVideoDialogOpen(false);
    } catch (error) {
      console.error('Error al agregar video:', error);
      toast.error('Error al agregar el video');
    }
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

  const selectedActressData = actresses?.find((a) => a.id === selectedActress);

  const filteredVideos = videos?.filter((video) => {
    // Si el video no tiene status definido, mostrarlo siempre
    if (video.status === undefined || video.status === null) return true;
    return showCompleted ? video.status === 1 : video.status === 0;
  });

  console.log('Videos data:', videos);
  console.log('Filtered videos:', filteredVideos);
  console.log('Show completed:', showCompleted);

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
            <Button
              onClick={() => setShowCompleted(!showCompleted)}
              size="icon"
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {showCompleted ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          {selectedActress ? (
            <Button
              onClick={() => setVideoDialogOpen(true)}
              disabled={createVideo.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Agregar Video
            </Button>
          ) : (
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Actriz
            </Button>
          )}
        </div>
      </div>

      {!selectedActress && (
        <div>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : actresses && actresses.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
              {actresses.map((actress) => (
                <div
                  key={actress.id}
                  className="relative w-full cursor-pointer transition-all hover:opacity-90"
                  style={{ paddingBottom: '150%' }}
                  onClick={() => handleSelectActress(actress.id)}
                >
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7 z-10 opacity-80 hover:opacity-100"
                    onClick={(e) => handleDeleteActress(actress.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  {actress.firstImageUrl ? (
                    <img
                      src={actress.firstImageUrl}
                      alt={actress.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                    <p className="font-medium text-sm text-white text-center truncate">{actress.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No hay actrices creadas</p>
          )}
        </div>
      )}

      {selectedActress && (
        <div>
          {isLoadingVideos ? (
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
                  </a>
                  <Button
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 bg-green-600 hover:bg-green-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleToggleVideoStatus(video.id, video.status || 0, e)}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No hay videos {showCompleted ? 'completados' : 'por ver'}
            </p>
          )}
        </div>
      )}

      <CreateActressDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleCreateActress}
      />

      {selectedActress && actresses && (
        <AddVideoDialog
          open={videoDialogOpen}
          onOpenChange={setVideoDialogOpen}
          currentActressId={selectedActress}
          actresses={actresses}
          onSave={handleAddVideo}
        />
      )}
    </div>
  );
};
