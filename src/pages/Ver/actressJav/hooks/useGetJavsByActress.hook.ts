import { useQuery } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';

export const useGetJavsByActress = (actressId: number) => {
  return useQuery({
    queryKey: ['actress-javs', actressId],
    queryFn: () => actressJavService.getJavsByActress(actressId),
    enabled: !!actressId,
  });
};
