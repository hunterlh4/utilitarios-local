import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useClearSteamLastPlay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.clearSteamLastPlay(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-steam'] }),
  });
};
