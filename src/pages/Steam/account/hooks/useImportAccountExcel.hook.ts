import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accountService } from '../services/account.service';

const ACCOUNT_QUERY_KEYS = [
  ['accounts'],
  ['accounts-email'],
  ['accounts-steam'],
  ['accounts-github'],
  ['accounts-general'],
  ['accounts-kiro'],
] as const;

export const useImportAccountExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => accountService.importExcel(file),
    onSuccess: (result) => {
      ACCOUNT_QUERY_KEYS.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });

      toast.success(
        `Importación lista. Creados: ${result.created}, Actualizados: ${result.updated}, Sin cambios: ${result.skipped}, Inválidos: ${result.invalid}`
      );
    },
    onError: () => toast.error('Error al importar'),
  });
};
