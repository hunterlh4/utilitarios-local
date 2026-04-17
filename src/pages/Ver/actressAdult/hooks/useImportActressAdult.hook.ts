import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { actressAdultService } from '../services/actressAdult.service';

export const useImportActressAdult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => actressAdultService.importExcel(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
      toast.success(
        `Importacion lista. Creados: ${result.created}, Actualizados: ${result.updated}, Sin cambios: ${result.skipped}, Invalidos: ${result.invalid}`
      );
    },
    onError: () => {
      toast.error('No se pudo importar el archivo');
    },
  });
};
