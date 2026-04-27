import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/project.service';
import type { UpdateProjectDto } from '../models/project-request.dto';

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectDto }) => projectService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};
