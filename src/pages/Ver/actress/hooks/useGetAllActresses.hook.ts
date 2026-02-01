import { useQuery } from '@tanstack/react-query';
import { actressService } from '../services/actress.service';

export const useGetAllActresses = () => {
  return useQuery({
    queryKey: ['actresses'],
    queryFn: actressService.getAll,
  });
};
