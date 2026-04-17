import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { hentaiService } from '../services/hentai.service';

export const useImportHentai = () => {
  return useMutation({
    mutationFn: (file: File) => hentaiService.importExcel(file),
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
