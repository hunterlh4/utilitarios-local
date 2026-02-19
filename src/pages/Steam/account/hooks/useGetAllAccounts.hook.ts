import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useGetAllAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAll(),
  });
};
