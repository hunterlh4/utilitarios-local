import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { CreateGitHubDto } from '../models/account-request.dto';

export const useAddGitHub = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGitHubDto) => accountService.createGitHub(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-github'] }),
  });
};
