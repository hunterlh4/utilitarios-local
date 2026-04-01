import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useGetGenerals = () => {
  return useQuery({
    queryKey: ['accounts-general'],
    queryFn: accountService.getGenerals,
  });
};
