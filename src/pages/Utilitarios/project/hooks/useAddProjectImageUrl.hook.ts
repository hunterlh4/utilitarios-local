import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/project.service';

export const useAddProjectImageUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, url }: { id: number; url: string }) => projectService.addImageUrl(id, url),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-detail', id] });
    },
  });
};
