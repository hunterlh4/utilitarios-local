import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressService } from '../services/actress.service';

export const useDeleteActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => actressService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
  });
};
