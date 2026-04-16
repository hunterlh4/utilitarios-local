import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { actressJavService } from '../services/actressJav.service';

export const useExportActressJav = () => {
  return useMutation({
    mutationFn: () => actressJavService.exportExcel(),
    onSuccess: () => {
      toast.success('Exportacion completada');
    },
    onError: () => {
      toast.error('No se pudo exportar el archivo');
    },
  });
};
