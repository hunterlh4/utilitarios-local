import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { youtubeService } from '../services/youtube.service';

export const useExportYouTube = () => {
  return useMutation({
    mutationFn: () => youtubeService.exportExcel(),
    onSuccess: () => {
      toast.success('Exportacion completada');
    },
    onError: () => {
      toast.error('No se pudo exportar el archivo');
    },
  });
};
