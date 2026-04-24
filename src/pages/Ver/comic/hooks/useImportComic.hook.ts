import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { comicService } from '../services/comic.service';

export const useImportComic = () => {
  return useMutation({
    mutationFn: (file: File) => comicService.importExcel(file),
    onSuccess: (result) => {
      toast.success(
        `Importación lista. Creados: ${result.created}, Actualizados: ${result.updated}, Sin cambios: ${result.skipped}, Inválidos: ${result.invalid}`
      );
    },
    onError: () => toast.error('No se pudo importar el archivo'),
  });
};
