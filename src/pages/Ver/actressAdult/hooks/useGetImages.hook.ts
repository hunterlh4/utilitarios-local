import { useQuery } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useGetImages = (actressId: number | null) => {
  return useQuery({
    queryKey: ['actressAdultDetail', actressId],
    queryFn: () => actressAdultService.getById(actressId!),
    enabled: actressId !== null,
    select: (data) => data.images,
  });
};
