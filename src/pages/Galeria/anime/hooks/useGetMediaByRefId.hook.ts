import { useQuery } from '@tanstack/react-query';
import { animeGaleryService } from '../services/anime-galery.service';

export const useGetMediaByRefId = (refId: number | null) => {
  return useQuery({
    queryKey: ['animeGaleryMedia', refId],
    queryFn: () => animeGaleryService.getMediaByRefId(refId!),
    enabled: refId !== null,
  });
};
