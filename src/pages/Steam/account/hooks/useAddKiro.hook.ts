import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { CreateKiroDto } from '../models/account-request.dto';

export const useAddKiro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKiroDto) => accountService.createKiro(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-kiro'] }),
  });
};
