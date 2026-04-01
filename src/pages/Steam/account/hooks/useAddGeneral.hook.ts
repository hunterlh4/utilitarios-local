import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { CreateGeneralDto } from '../models/account-request.dto';

export const useAddGeneral = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGeneralDto) => accountService.createGeneral(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-general'] }),
  });
};
