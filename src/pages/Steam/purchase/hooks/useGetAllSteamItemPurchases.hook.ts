import { useQuery } from '@tanstack/react-query';
import { steamItemPurchaseService } from '../services/steam-item-purchase.service';

export const useGetAllSteamItemPurchases = () => {
  return useQuery({
    queryKey: ['steam-item-purchases'],
    queryFn: steamItemPurchaseService.getAll,
  });
};
