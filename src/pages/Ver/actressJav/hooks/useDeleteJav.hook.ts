import { useMutation, useQueryClient } from '@tanstack/react-query';
import { javService } from '@/pages/Ver/jav/services/jav.service';
import { toast } from 'sonner';

export const useDeleteJav = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => javService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actress-javs'] });
      toast.success('JAV eliminado correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar el JAV');
    },
  });
};
