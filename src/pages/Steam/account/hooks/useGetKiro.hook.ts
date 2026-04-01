import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useGetKiro = () => {
  return useQuery({
    queryKey: ['accounts-kiro'],
    queryFn: accountService.getKiro,
  });
};
