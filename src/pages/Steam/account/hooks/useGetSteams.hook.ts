import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useGetSteams = (enabled = true) => {
  return useQuery({
    queryKey: ['accounts-steam'],
    queryFn: accountService.getSteams,
    enabled,
  });
};
