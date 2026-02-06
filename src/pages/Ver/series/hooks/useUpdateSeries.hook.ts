import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seriesService } from '../services/series.service';
import type { UpdateSeriesDto } from '../models/series-request.dto';

export const useUpdateSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSeriesDto }) =>
      seriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
    },
  });
};
