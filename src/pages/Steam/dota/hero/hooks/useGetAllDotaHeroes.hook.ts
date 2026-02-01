import { useQuery } from '@tanstack/react-query';
import { dotaHeroService } from '../services/dota-hero.service';

export const useGetAllDotaHeroes = () => {
  return useQuery({
    queryKey: ['dota-heroes'],
    queryFn: dotaHeroService.getAll,
  });
};
