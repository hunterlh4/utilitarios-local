import { useMutation, useQueryClient } from '@tanstack/react-query';
import { girlService } from '../services/girl.service';

export const useDeleteGirl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => girlService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['girls'] });
    },
  });
};
