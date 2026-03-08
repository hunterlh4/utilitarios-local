import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: number) => actressAdultService.deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdultDetail'] });
    },
  });
};
