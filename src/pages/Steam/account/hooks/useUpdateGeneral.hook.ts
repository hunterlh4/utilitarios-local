import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { UpdateGeneralDto } from '../models/account-request.dto';

export const useUpdateGeneral = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGeneralDto }) => accountService.updateGeneral(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-general'] }),
  });
};
