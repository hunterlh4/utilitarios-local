import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../services/tag.service';
import type { UpdateTagDto } from '../models/tag-request.dto';

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
