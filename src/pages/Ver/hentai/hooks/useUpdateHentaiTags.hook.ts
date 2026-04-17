import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hentaiService } from '../services/hentai.service';

export const useUpdateHentaiTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tagIds }: { id: number; tagIds: number[] }) =>
      hentaiService.updateTags(id, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hentai'] });
    },
  });
};