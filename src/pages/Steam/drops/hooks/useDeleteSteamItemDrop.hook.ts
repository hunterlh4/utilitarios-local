import { useMutation, useQueryClient } from '@tanstack/react-query';
import { steamItemDropService } from '../services/steam-item-drop.service';

export const useDeleteSteamItemDrop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => steamItemDropService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steam-item-drops'] });
    },
  });
};
