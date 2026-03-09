import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) =>
      actressJavService.uploadImage(file, refId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
  });
};
