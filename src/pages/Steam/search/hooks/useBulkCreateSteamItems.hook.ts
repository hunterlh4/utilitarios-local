import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { steamSearchService, type BulkSteamItemDto } from '../services/steam-search.service';

export const useBulkCreateSteamItems = () => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const bulkCreate = async (items: BulkSteamItemDto[]) => {
    setIsPending(true);
    try {
      const result = await steamSearchService.bulkCreate(items);
      queryClient.invalidateQueries({ queryKey: ['steam-items'] });
      return result;
    } finally {
      setIsPending(false);
    }
  };

  return { bulkCreate, isPending };
};
