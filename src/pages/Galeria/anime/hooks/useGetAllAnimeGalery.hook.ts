import { useQuery } from '@tanstack/react-query';
import { animeGaleryService } from '../services/anime-galery.service';

export const useGetAllAnimeGalery = () => {
  return useQuery({
    queryKey: ['anime-galery'],
    queryFn: animeGaleryService.getAll,
  });
};
