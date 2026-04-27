import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/project.service';
import type { CreateProjectDto } from '../models/project-request.dto';

export const useAddProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectDto) => projectService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};
