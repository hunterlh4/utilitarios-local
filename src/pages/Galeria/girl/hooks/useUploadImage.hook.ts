import { useMutation, useQueryClient } from '@tanstack/react-query';
import { girlGaleryService } from '../services/girl.service';

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) =>
      girlGaleryService.uploadImage(file, refId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['girlGaleryDetail', variables.refId] });
      queryClient.invalidateQueries({ queryKey: ['girlGalery'] });
    },
  });
};
