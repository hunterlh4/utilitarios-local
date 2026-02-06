import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hentaiService } from '../services/hentai.service';

export const useDeleteHentai = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => hentaiService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hentai'] });
    },
  });
};
