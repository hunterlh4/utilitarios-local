import { useQuery } from '@tanstack/react-query';
import { girlGaleryService } from '../services/girl.service';

export const useGetAllGirls = () => {
  return useQuery({
    queryKey: ['girls'],
    queryFn: girlGaleryService.getAll,
  });
};
