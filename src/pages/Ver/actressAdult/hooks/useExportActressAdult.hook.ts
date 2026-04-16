import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { actressAdultService } from '../services/actressAdult.service';

export const useExportActressAdult = () => {
  return useMutation({
    mutationFn: () => actressAdultService.exportExcel(),
    onSuccess: () => {
      toast.success('Exportacion completada');
    },
    onError: () => {
      toast.error('No se pudo exportar el archivo');
    },
  });
};
