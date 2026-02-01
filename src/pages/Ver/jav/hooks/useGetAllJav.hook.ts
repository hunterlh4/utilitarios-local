import { useQuery } from '@tanstack/react-query';
import { javService } from '../services/jav.service';

export const useGetAllJav = () => {
  return useQuery({
    queryKey: ['jav'],
    queryFn: javService.getAll,
  });
};
