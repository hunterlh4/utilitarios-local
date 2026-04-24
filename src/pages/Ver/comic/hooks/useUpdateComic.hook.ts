import { useMutation, useQueryClient } from '@tanstack/react-query';
import { comicService } from '../services/comic.service';
import type { UpdateComicDto } from '../models/comic-request.dto';

export const useUpdateComic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateComicDto }) => comicService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comic'] }),
  });
};
