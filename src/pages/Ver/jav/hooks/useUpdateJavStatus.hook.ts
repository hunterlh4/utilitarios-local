import { useMutation, useQueryClient } from '@tanstack/react-query';
import { javService } from '../services/jav.service';

export const useUpdateJavStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      javService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jav'] });
    },
  });
};
