import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useUpdateSteamLastPlay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.updateSteamLastPlay(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-steam'] }),
  });
};
