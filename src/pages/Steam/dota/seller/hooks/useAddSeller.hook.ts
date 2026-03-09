import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerService } from '../services/seller.service';
import type { CreateSellerDto } from '../models/seller-request.dto';

export const useAddSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSellerDto) => sellerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
  });
};
