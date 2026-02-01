import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seriesService } from '../services/series.service';
import { CreateSeriesDto } from '../models/series-request.dto';

export const useAddSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSeriesDto) => seriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
    },
  });
};
