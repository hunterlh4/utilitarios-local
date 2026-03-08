import { useQuery } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useGetActressDetail = (actressId: number | null) => {
  return useQuery({
    queryKey: ['actressAdultDetail', actressId],
    queryFn: () => actressAdultService.getDetailById(actressId!),
    enabled: actressId !== null,
  });
};
