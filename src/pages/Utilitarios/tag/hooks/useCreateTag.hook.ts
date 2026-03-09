import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../services/tag.service';
import type { CreateTagDto } from '../models/tag-request.dto';

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagDto) => tagService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags', variables.type] });
    },
  });
};
