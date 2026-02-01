import { useMutation, useQueryClient } from '@tanstack/react-query';
import { youtubeService } from '../services/youtube.service';

export const useDeleteYouTube = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => youtubeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtube'] });
    },
  });
};
