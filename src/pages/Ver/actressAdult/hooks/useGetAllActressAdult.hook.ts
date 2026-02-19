import { useQuery } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useGetAllActressAdult = () => {
  return useQuery({
    queryKey: ['actressAdult'],
    queryFn: () => actressAdultService.getAll(),
  });
};
