import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { CreateEmailDto } from '../models/account-request.dto';

export const useAddEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmailDto) => accountService.createEmail(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-email'] }),
  });
};
