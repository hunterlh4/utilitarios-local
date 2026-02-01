import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import { UpdateAccountDto } from '../models/account-request.dto';

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAccountDto }) =>
      accountService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};
