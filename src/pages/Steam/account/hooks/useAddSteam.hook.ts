import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { CreateSteamDto } from '../models/account-request.dto';

export const useAddSteam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSteamDto) => accountService.createSteam(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts-steam'] }),
  });
};
