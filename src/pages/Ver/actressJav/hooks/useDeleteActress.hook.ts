import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';
import { toast } from 'sonner';

export const useDeleteActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => actressJavService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
      toast.success('Actriz eliminada correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar la actriz');
    },
  });
};
