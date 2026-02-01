import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeGaleryService } from '../services/anime-galery.service';

export const useDeleteAnimeGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => animeGaleryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime-galery'] });
    },
  });
};
