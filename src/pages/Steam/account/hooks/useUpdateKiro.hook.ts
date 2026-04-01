import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { UpdateKiroDto } from '../models/account-request.dto';

export const useUpdateKiro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateKiroDto }) => accountService.updateKiro(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-kiro'] }),
  });
};
