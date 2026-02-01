import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dotaHeroService } from '../services/dota-hero.service';

export const useDeleteDotaHero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => dotaHeroService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dota-heroes'] });
    },
  });
};
