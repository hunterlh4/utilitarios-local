import { useMutation, useQueryClient } from '@tanstack/react-query';
import { youtubeService } from '../services/youtube.service';
import type { UpdateYouTubeDto } from '../models/youtube-request.dto';

export const useUpdateYouTube = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateYouTubeDto }) =>
      youtubeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtube'] });
    },
  });
};
