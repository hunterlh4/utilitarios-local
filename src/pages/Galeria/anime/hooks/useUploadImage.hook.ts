import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeGaleryService } from '../services/anime-galery.service';

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) =>
      animeGaleryService.uploadImage(file, refId),
    onSuccess: (_, variables) => {
      // Invalida el detalle de la galería específica
      queryClient.invalidateQueries({ queryKey: ['animeGaleryDetail', variables.refId] });
      // Invalida la lista de galerías para actualizar la imagen de portada
      queryClient.invalidateQueries({ queryKey: ['animeGalery'] });
    },
  });
};
