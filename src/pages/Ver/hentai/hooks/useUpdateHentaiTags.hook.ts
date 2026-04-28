import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hentaiService } from '../services/hentai.service';

export const useUpdateHentaiTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tagIds, name }: { id: number; tagIds: number[]; name?: string }) =>
      hentaiService.updateTags(id, tagIds, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hentai'] });
    },
  });
};