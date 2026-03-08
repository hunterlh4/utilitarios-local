import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId: number) => actressAdultService.deleteMedia(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
    },
  });
};
