import { useMutation, useQueryClient } from '@tanstack/react-query';
import { girlGaleryService } from '../services/girl.service';
import { useLoading } from '@/common/context/loading/LoadingContext';

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  const loading = useLoading();

  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) =>
      girlGaleryService.uploadImage(file, refId),
    onMutate: () => {
      loading.show('Subiendo imagen...');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['girlGaleryDetail', variables.refId] });
      queryClient.invalidateQueries({ queryKey: ['girlGalery'] });
    },
    onSettled: () => {
      loading.hide();
    },
  });
};
