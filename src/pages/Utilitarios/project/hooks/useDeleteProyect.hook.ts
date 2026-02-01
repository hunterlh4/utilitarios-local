import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proyectService } from '../services/project.service';

export const useDeleteProyect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => proyectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyects'] });
    },
  });
};
