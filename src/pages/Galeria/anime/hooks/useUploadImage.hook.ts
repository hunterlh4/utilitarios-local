import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeGaleryService } from '../services/anime-galery.service';

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) =>
      animeGaleryService.uploadImage(file, refId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animeGaleryMedia'] });
    },
  });
};
