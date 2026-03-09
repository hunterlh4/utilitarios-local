import { useMutation, useQueryClient } from '@tanstack/react-query';
import { javService } from '@/pages/Ver/jav/services/jav.service';

export const useDeleteJav = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => javService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actress-javs'] });
    },
  });
};
