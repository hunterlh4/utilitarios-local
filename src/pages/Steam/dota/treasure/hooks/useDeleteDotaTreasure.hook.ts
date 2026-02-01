import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dotaTreasureService } from '../services/dota-treasure.service';

export const useDeleteDotaTreasure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => dotaTreasureService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dota-treasures'] });
    },
  });
};
