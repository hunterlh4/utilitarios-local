import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';
import { toast } from 'sonner';

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, actressIds, tagIds }: { videoId: number; actressIds: number[]; tagIds: number[] }) =>
      actressAdultService.updateVideo(videoId, actressIds, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdultDetail'] });
      toast.success('Video actualizado correctamente');
    },
    onError: () => {
      toast.error('Error al actualizar el video');
    },
  });
};
