import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../models/payment-request.dto';

export const useAddPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentDto) => paymentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};
