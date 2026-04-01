import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useDeleteGeneral = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.deleteGeneral(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-general'] }),
  });
};
