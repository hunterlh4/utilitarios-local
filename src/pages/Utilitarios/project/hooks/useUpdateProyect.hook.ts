import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proyectService } from '../services/project.service';
import type { UpdateProyectDto } from '../models/project-request.dto';

export const useUpdateProyect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProyectDto }) =>
      proyectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyects'] });
    },
  });
};
