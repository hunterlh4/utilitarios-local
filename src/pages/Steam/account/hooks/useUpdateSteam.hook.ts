import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { UpdateSteamDto } from '../models/account-request.dto';

export const useUpdateSteam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSteamDto }) => accountService.updateSteam(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-steam'] }),
  });
};
