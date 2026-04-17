import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { seriesService } from '../services/series.service';

export const useExportSeries = () => {
  return useMutation({
    mutationFn: () => seriesService.exportExcel(),
    onSuccess: () => {
      toast.success('Exportacion completada');
    },
    onError: () => {
      toast.error('No se pudo exportar el archivo');
    },
  });
};
