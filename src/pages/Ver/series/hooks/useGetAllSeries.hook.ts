import { useQuery } from '@tanstack/react-query';
import { seriesService } from '../services/series.service';

export const useGetAllSeries = () => {
  return useQuery({
    queryKey: ['series'],
    queryFn: seriesService.getAll,
  });
};
