import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeService } from '../services/anime.service';
import type { CreateAnimeDto } from '../models/anime-request.dto';

export const useAddAnime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnimeDto) => animeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime'] });
    },
  });
};
