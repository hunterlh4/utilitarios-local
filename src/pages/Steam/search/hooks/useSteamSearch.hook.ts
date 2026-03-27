import { useState } from 'react';
import { steamSearchService } from '../services/steam-search.service';
import type { SteamSearchResponse } from '../models/steam-search.model';

export const useSteamSearch = () => {
  const [data, setData] = useState<SteamSearchResponse | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const search = async (q: string, g: 1 | 2) => {
    setIsFetching(true);
    try {
      const result = await steamSearchService.search(q, g);
      setData(result);
    } finally {
      setIsFetching(false);
    }
  };

  return { search, data, isFetching };
};
