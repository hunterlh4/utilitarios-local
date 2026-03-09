import { useMutation, useQueryClient } from '@tanstack/react-query';
import { steamItemPurchaseService } from '../services/steam-item-purchase.service';
import type { UpdateSteamItemPurchaseDto } from '../models/steam-item-purchase-request.dto';

export const useUpdateSteamItemPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSteamItemPurchaseDto }) =>
      steamItemPurchaseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steam-item-purchases'] });
    },
  });
};
