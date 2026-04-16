import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';
import { useLoading } from '@/common/context/loading/LoadingContext';
import { toast } from 'sonner';

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
      toast.success('Imagen subida correctamente');
    },
    onError: () => {
      toast.error('Error al subir la imagen');
    },
    onSettled: () => {
      loading.hide();
    },
  });
};
