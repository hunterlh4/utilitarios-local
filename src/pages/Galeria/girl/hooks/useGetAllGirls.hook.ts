import { useQuery } from '@tanstack/react-query';
import { girlService } from '../services/girl.service';

export const useGetAllGirls = () => {
  return useQuery({
    queryKey: ['girls'],
    queryFn: girlService.getAll,
  });
};
