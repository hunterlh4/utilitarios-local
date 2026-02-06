import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeService } from '../services/anime.service';

export const useUpdateAnimeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      animeService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime'] });
    },
  });
};
