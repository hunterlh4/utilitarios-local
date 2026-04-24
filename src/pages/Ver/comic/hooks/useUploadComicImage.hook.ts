import { useMutation, useQueryClient } from '@tanstack/react-query';
import { comicService } from '../services/comic.service';

export const useUploadComicImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) => comicService.uploadImage(file, refId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comic'] }),
  });
};
