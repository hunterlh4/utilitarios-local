import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeGaleryService } from '../services/anime-galery.service';
import { UpdateAnimeGaleryDto } from '../models/anime-galery-request.dto';

export const useUpdateAnimeGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAnimeGaleryDto }) =>
      animeGaleryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime-galery'] });
    },
  });
};
