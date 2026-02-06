import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeGaleryService } from '../services/anime-galery.service';

export const useCreateAnimeGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => animeGaleryService.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animeGalery'] });
    },
  });
};
