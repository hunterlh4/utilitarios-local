import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { javService } from '../services/jav.service';
import { downloadBase64File } from '@/common/lib/download-file';

export const useExportJavExcel = () => {
  return useMutation({
    mutationFn: () => javService.exportExcel(),
    onSuccess: (file) => {
      downloadBase64File(file.base64, file.fileName || 'jav-export.xlsx');
      toast.success('Exportación completada');
    },
    onError: () => toast.error('No se pudo exportar el archivo'),
  });
};
