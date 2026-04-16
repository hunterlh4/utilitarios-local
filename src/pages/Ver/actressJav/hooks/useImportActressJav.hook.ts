import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { actressJavService } from '../services/actressJav.service';

export const useImportActressJav = () => {
  return useMutation({
    mutationFn: (file: File) => actressJavService.importExcel(file),
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
