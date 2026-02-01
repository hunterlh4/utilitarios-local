import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proyectService } from '../services/project.service';
import { CreateProyectDto } from '../models/project-request.dto';

export const useAddProyect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProyectDto) => proyectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyects'] });
    },
  });
};
