import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { comicService } from '../services/comic.service';

export const useExportComic = () => {
  return useMutation({
    mutationFn: () => comicService.exportExcel(),
    onSuccess: () => toast.success('Exportación completada'),
    onError: () => toast.error('No se pudo exportar el archivo'),
  });
};
