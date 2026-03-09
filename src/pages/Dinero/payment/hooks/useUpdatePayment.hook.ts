import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/payment.service';
import type { UpdatePaymentDto } from '../models/payment-request.dto';

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaymentDto }) =>
      paymentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};
