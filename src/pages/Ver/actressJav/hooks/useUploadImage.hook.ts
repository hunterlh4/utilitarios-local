import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';
import { useLoading } from '@/common/context/loading/LoadingContext';
import { toast } from 'sonner';

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  const loading = useLoading();

  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) =>
      actressJavService.uploadImage(file, refId),
    onMutate: () => {
      loading.show('Subiendo imagen...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
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
