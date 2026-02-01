import { useQuery } from '@tanstack/react-query';
import { sellerService } from '../services/seller.service';

export const useGetAllSellers = () => {
  return useQuery({
    queryKey: ['sellers'],
    queryFn: sellerService.getAll,
  });
};
