import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeGaleryService } from '../services/anime-galery.service';
import type { UpdateAnimeGaleryDto } from '../models/anime-galery.model';

export const useUpdateAnimeGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAnimeGaleryDto }) =>
      animeGaleryService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['animeGalery'] });
      queryClient.invalidateQueries({ queryKey: ['animeGaleryDetail', variables.id] });
    },
  });
};
