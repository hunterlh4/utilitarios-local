import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useGetEmails = () => {
  return useQuery({
    queryKey: ['accounts-email'],
    queryFn: accountService.getEmails,
  });
};
