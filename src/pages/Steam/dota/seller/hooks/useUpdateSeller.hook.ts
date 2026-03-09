import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerService } from '../services/seller.service';
import type { UpdateSellerDto } from '../models/seller-request.dto';

export const useUpdateSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSellerDto }) =>
      sellerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
  });
};
