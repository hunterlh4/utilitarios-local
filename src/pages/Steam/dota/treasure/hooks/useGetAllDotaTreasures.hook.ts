import { useQuery } from '@tanstack/react-query';
import { dotaTreasureService } from '../services/dota-treasure.service';

export const useGetAllDotaTreasures = () => {
  return useQuery({
    queryKey: ['dota-treasures'],
    queryFn: dotaTreasureService.getAll,
  });
};
