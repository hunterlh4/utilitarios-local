import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import { CreateAccountDto } from '../models/account-request.dto';

export const useAddAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountDto) => accountService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};
