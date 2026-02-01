import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dotaHeroService } from '../services/dota-hero.service';
import { UpdateDotaHeroDto } from '../models/dota-hero-request.dto';

export const useUpdateDotaHero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDotaHeroDto }) =>
      dotaHeroService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dota-heroes'] });
    },
  });
};
