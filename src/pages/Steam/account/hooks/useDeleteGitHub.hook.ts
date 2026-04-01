import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useDeleteGitHub = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.deleteGitHub(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-github'] }),
  });
};
