import { useQuery } from '@tanstack/react-query';
import { steamItemService } from '../services/steam-item.service';

export const useGetAllSteamItems = () => {
  return useQuery({
    queryKey: ['steam-items'],
    queryFn: steamItemService.getAll,
  });
};
