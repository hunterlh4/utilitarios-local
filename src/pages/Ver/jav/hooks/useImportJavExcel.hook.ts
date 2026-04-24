import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { javService } from '../services/jav.service';

export const useImportJavExcelTemporal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => javService.importExcelTemporal(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['jav'] });
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
      toast.success(
        `Importación temporal lista. JAVs: ${result.javsCreated}, Actrices: ${result.actressesCreated}, Omitidos: ${result.skipped}`
      );
    },
    onError: () => toast.error('No se pudo importar el archivo temporal'),
  });
};

export const useImportJavExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => javService.importExcel(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['jav'] });
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
      toast.success(
        `Importación lista. JAVs: ${result.javsCreated}, Actrices: ${result.actressesCreated}, Omitidos: ${result.skipped}`
      );
    },
    onError: () => toast.error('No se pudo importar el archivo'),
  });
};
