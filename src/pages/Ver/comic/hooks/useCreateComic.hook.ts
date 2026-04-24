import { useMutation, useQueryClient } from '@tanstack/react-query';
import { comicService } from '../services/comic.service';
import type { CreateComicDto } from '../models/comic-request.dto';

export const useCreateComic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateComicDto) => comicService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comic'] }),
  });
};
