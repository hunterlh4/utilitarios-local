import { useMutation, useQueryClient } from '@tanstack/react-query';
import { steamItemPurchaseService } from '../services/steam-item-purchase.service';

export const useDeleteSteamItemPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => steamItemPurchaseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steam-item-purchases'] });
    },
  });
};
