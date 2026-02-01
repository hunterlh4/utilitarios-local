import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dotaHeroService } from '../services/dota-hero.service';
import { CreateDotaHeroDto } from '../models/dota-hero-request.dto';

export const useAddDotaHero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDotaHeroDto) => dotaHeroService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dota-heroes'] });
    },
  });
};
