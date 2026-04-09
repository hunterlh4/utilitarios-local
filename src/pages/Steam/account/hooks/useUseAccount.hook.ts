import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

// NOTA: Este hook es específico para usar Kiro
// Use useUpdateKiro si va a actualizar, o useKiroUse para usar un Kiro
export const useUseAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.useKiro(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });
};
