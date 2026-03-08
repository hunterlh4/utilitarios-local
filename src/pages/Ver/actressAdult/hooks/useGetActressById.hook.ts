import { useQuery } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useGetActressById = (id: number | null) => {
  return useQuery({
    queryKey: ['actressAdult', id],
    queryFn: () => actressAdultService.getById(id!),
    enabled: !!id,
  });
};
