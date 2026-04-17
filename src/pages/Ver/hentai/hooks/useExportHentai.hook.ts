import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { hentaiService } from '../services/hentai.service';

export const useExportHentai = () => {
  return useMutation({
    mutationFn: () => hentaiService.exportExcel(),
    onSuccess: () => {
      toast.success('Exportacion completada');
    },
    onError: () => {
      toast.error('No se pudo exportar el archivo');
    },
  });
};
