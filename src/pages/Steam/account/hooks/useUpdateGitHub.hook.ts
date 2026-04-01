import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { UpdateGitHubDto } from '../models/account-request.dto';

export const useUpdateGitHub = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGitHubDto }) => accountService.updateGitHub(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-github'] }),
  });
};
