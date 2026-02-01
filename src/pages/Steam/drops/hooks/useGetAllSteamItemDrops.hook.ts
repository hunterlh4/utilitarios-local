import { useQuery } from '@tanstack/react-query';
import { steamItemDropService } from '../services/steam-item-drop.service';

export const useGetAllSteamItemDrops = () => {
  return useQuery({
    queryKey: ['steam-item-drops'],
    queryFn: steamItemDropService.getAll,
  });
};
