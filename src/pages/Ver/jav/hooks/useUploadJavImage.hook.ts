import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLoading } from '@/common/context/loading/LoadingContext';
import { javService } from '../services/jav.service';

export const useUploadJavImage = () => {
  const queryClient = useQueryClient();
  const loading = useLoading();

  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) =>
      javService.uploadImage(file, refId),
    onMutate: () => loading.show('Subiendo imagen...'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jav'] });
      queryClient.invalidateQueries({ queryKey: ['actress-javs'] });
    },
    onSettled: () => loading.hide(),
  });
};
