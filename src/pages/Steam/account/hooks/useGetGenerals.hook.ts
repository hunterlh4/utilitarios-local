import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useGetGenerals = (enabled = true) => {
  return useQuery({
    queryKey: ['accounts-general'],
    queryFn: accountService.getGenerals,
    enabled,
  });
};
