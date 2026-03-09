import { useMutation, useQueryClient } from '@tanstack/react-query';
import { girlGaleryService } from '../services/girl.service';

export const useDeleteGirl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => girlGaleryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['girls'] });
    },
  });
};
