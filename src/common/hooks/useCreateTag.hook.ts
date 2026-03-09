import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { tagService, type CreateTagDto } from '../services/tag.service';

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagDto) => tagService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
