import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/project.service';

export const useDeleteProjectMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // El mediaId no tiene el projectId, así que invalidamos todos los detalles
    mutationFn: (mediaId: number) => projectService.deleteMedia(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-detail'] });
    },
  });
};
