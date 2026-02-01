import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../services/payment.service';

export const useGetAllPayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: paymentService.getAll,
  });
};
