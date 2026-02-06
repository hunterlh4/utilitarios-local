import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seriesService } from '../services/series.service';

export const useUpdateSeriesStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      seriesService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
    },
  });
};
