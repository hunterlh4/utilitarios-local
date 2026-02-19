import { useQuery } from '@tanstack/react-query';
import { girlGaleryService } from '../services/girl.service';

export const useGetAllGirlGalery = () => {
  return useQuery({
    queryKey: ['girlGalery'],
    queryFn: () => girlGaleryService.getAll(),
  });
};
