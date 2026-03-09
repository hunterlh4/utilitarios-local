import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { tagService, type UpdateTagDto } from '../services/tag.service';

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTagDto }) =>
      tagService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
