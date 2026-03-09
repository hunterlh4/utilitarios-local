import { useMutation, useQueryClient } from '@tanstack/react-query';
import { youtubeService } from '../services/youtube.service';
import type { CreateYouTubeDto } from '../models/youtube-request.dto';

export const useAddYouTube = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateYouTubeDto) => youtubeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtube'] });
    },
  });
};
