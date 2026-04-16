import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeGaleryService } from '../services/anime-galery.service';
import { useLoading } from '@/common/context/loading/LoadingContext';

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  const loading = useLoading();

  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) =>
      animeGaleryService.uploadImage(file, refId),
    onMutate: () => {
      loading.show('Subiendo imagen...');
    },
    onSuccess: (_, variables) => {
      // Invalida el detalle de la galería específica
      queryClient.invalidateQueries({ queryKey: ['animeGaleryDetail', variables.refId] });
      // Invalida la lista de galerías para actualizar la imagen de portada
      queryClient.invalidateQueries({ queryKey: ['animeGalery'] });
    },
    onSettled: () => {
      loading.hide();
    },
  });
};
