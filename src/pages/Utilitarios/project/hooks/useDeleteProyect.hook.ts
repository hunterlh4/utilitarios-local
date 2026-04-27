import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/project.service';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};
