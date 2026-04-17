import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { animeService } from '../services/anime.service';

export const useImportAnime = () => {
  return useMutation({
    mutationFn: (file: File) => animeService.importExcel(file),
    onSuccess: (result) => {
      toast.success(
        `Importacion lista. Creados: ${result.created}, Actualizados: ${result.updated}, Sin cambios: ${result.skipped}, Invalidos: ${result.invalid}`
      );
    },
    onError: () => {
      toast.error('No se pudo importar el archivo');
    },
  });
};
