import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { UpdateEmailDto } from '../models/account-request.dto';

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmailDto }) => accountService.updateEmail(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-email'] }),
  });
};
