import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { animeService } from '../services/anime.service';

export const useExportAnime = () => {
  return useMutation({
    mutationFn: () => animeService.exportExcel(),
    onSuccess: () => {
      toast.success('Exportacion completada');
    },
    onError: () => {
      toast.error('No se pudo exportar el archivo');
    },
  });
};
