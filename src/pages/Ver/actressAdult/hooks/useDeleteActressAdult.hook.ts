import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useDeleteActressAdult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => actressAdultService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
    },
  });
};
