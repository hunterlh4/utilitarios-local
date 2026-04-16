import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';
import { toast } from 'sonner';

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: number) => actressAdultService.deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdultDetail'] });
      toast.success('Video eliminado correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar el video');
    },
  });
};
