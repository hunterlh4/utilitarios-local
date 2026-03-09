import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dotaCacheService } from '../services/dota-cache.service';
import type { UpdateDotaCacheDto } from '../models/dota-cache-request.dto';

export const useUpdateDotaCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDotaCacheDto }) =>
      dotaCacheService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dota-caches'] });
    },
  });
};
