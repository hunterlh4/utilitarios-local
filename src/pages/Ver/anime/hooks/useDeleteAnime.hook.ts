import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeService } from '../services/anime.service';

export const useDeleteAnime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => animeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime'] });
    },
  });
};
