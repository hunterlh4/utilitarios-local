import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerService } from '../services/seller.service';

export const useDeleteSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sellerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
  });
};
