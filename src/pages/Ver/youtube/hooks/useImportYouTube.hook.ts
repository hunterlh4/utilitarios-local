import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { youtubeService } from '../services/youtube.service';

export const useImportYouTube = () => {
  return useMutation({
    mutationFn: (file: File) => youtubeService.importExcel(file),
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
