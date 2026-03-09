import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeService } from '../services/anime.service';
import type { UpdateAnimeDto } from '../models/anime-request.dto';

export const useUpdateAnime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAnimeDto }) =>
      animeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime'] });
    },
  });
};
