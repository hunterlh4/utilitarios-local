import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seriesService } from '../services/series.service';

export const useDeleteSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => seriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
    },
  });
};
