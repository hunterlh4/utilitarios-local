import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { actressAdultService } from '../services/actressAdult.service';

export const useImportActressAdult = () => {
  return useMutation({
    mutationFn: (file: File) => actressAdultService.importExcel(file),
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
