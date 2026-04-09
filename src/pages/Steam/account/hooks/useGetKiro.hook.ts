import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useGetKiro = (enabled = true) => {
  return useQuery({
    queryKey: ['accounts-kiro'],
    queryFn: accountService.getKiro,
    enabled,
  });
};
