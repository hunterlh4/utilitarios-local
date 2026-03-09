import { useQuery } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';

export const useGetAllActressJav = () => {
  return useQuery({
    queryKey: ['actressJav'],
    queryFn: () => actressJavService.getAll(),
  });
};
