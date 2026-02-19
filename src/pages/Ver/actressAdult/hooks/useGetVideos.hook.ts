import { useQuery } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useGetVideos = (actressId: number | null) => {
  return useQuery({
    queryKey: ['actressAdultVideos', actressId],
    queryFn: () => actressAdultService.getById(actressId!),
    enabled: actressId !== null,
    select: (data) => data.videos,
  });
};
