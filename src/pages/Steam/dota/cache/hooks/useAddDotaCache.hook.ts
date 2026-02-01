import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dotaCacheService } from '../services/dota-cache.service';
import { CreateDotaCacheDto } from '../models/dota-cache-request.dto';

export const useAddDotaCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDotaCacheDto) => dotaCacheService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dota-caches'] });
    },
  });
};
