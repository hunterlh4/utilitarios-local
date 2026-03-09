import { useQuery } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';

export const useGetAllActresses = () => {
  return useQuery({
    queryKey: ['actresses'],
    queryFn: actressJavService.getAll,
  });
};
