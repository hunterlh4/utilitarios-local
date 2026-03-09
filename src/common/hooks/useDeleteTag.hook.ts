import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../services/tag.service';

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tagService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
