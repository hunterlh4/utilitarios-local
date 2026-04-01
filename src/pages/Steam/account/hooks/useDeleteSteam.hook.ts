import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useDeleteSteam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.deleteSteam(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-steam'] }),
  });
};
