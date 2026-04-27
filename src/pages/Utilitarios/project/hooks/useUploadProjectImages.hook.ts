import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/project.service';

export const useUploadProjectImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }: { id: number; files: File[] }) => projectService.uploadImages(id, files),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-detail', id] });
    },
  });
};
