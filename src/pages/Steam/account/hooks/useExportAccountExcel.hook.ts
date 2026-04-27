import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accountService } from '../services/account.service';
import { downloadBase64File } from '@/common/lib/download-file';

export const useExportAccountExcel = () => {
  return useMutation({
    mutationFn: () => accountService.exportExcel(),
    onSuccess: (file) => {
      downloadBase64File(file.base64, file.fileName || 'accounts.xlsx');
      toast.success('Exportación completada');
    },
    onError: () => {
      toast.error('Error al exportar');
    },
  });
};
