import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useUseKiro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.useKiro(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-kiro'] }),
  });
};
