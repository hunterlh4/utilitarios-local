import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';

export const useDeleteActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => actressJavService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
  });
};
