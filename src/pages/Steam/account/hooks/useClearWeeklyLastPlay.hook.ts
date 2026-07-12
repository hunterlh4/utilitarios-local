import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useClearWeeklyLastPlay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => accountService.clearWeeklyLastPlay(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-steam'] }),
  });
};
