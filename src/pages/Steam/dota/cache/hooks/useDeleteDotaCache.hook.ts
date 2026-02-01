import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dotaCacheService } from '../services/dota-cache.service';

export const useDeleteDotaCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => dotaCacheService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dota-caches'] });
    },
  });
};
