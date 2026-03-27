import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useUseAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.use(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });
};
