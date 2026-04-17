import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { seriesService } from '../services/series.service';

export const useImportSeries = () => {
  return useMutation({
    mutationFn: (file: File) => seriesService.importExcel(file),
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
