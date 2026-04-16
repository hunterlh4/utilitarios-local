import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';
import { useLoading } from '@/common/context/loading/LoadingContext';

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  const loading = useLoading();

  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) =>
      actressAdultService.uploadImage(file, refId),
    onMutate: () => {
      loading.show('Subiendo imagen...');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['actressAdultDetail', variables.refId] });
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
    },
    onSettled: () => {
      loading.hide();
    },
  });
};
