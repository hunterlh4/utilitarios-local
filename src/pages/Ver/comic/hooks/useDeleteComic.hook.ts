import { useMutation, useQueryClient } from '@tanstack/react-query';
import { comicService } from '../services/comic.service';

export const useDeleteComic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => comicService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comic'] }),
  });
};
