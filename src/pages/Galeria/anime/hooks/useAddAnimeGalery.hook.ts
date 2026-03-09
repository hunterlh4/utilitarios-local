import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeGaleryService } from '../services/anime-galery.service';
import type { CreateAnimeGaleryDto } from '../models/anime-galery-request.dto';

export const useAddAnimeGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnimeGaleryDto) => animeGaleryService.create(data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime-galery'] });
    },
  });
};
