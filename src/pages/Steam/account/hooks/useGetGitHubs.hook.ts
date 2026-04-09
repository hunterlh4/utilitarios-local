import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useGetGitHubs = (enabled = true) => {
  return useQuery({
    queryKey: ['accounts-github'],
    queryFn: accountService.getGitHubs,
    enabled,
  });
};
