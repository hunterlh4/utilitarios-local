import { useQuery } from '@tanstack/react-query';
import { girlGaleryService } from '../services/girl.service';

export const useGetMediaByRefId = (refId: number | null) => {
  return useQuery({
    queryKey: ['girlGaleryDetail', refId],
    queryFn: () => girlGaleryService.getById(refId!),
    enabled: refId !== null,
    select: (data) => data.media,
  });
};
