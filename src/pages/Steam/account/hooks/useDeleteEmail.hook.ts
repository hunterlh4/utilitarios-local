import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useDeleteEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.deleteEmail(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-email'] }),
  });
};
