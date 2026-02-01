import { useQuery } from '@tanstack/react-query';
import { dotaCacheService } from '../services/dota-cache.service';

export const useGetAllDotaCaches = () => {
  return useQuery({
    queryKey: ['dota-caches'],
    queryFn: dotaCacheService.getAll,
  });
};
