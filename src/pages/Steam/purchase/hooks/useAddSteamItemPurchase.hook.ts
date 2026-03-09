import { useMutation, useQueryClient } from '@tanstack/react-query';
import { steamItemPurchaseService } from '../services/steam-item-purchase.service';
import type { CreateSteamItemPurchaseDto } from '../models/steam-item-purchase-request.dto';

export const useAddSteamItemPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSteamItemPurchaseDto) => steamItemPurchaseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steam-item-purchases'] });
    },
  });
};
