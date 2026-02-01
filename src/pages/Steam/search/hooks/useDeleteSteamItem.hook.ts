import { useMutation, useQueryClient } from '@tanstack/react-query';
import { steamItemService } from '../services/steam-item.service';

export const useDeleteSteamItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => steamItemService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steam-items'] });
    },
  });
};
