import { useQuery } from '@tanstack/react-query';
import { animeService } from '../services/anime.service';

export const useGetAllAnime = () => {
  return useQuery({
    queryKey: ['anime'],
    queryFn: animeService.getAll,
  });
};
