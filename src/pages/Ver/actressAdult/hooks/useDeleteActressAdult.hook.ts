import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';
import { toast } from 'sonner';

export const useDeleteActressAdult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => actressAdultService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
      toast.success('Actriz eliminada correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar la actriz');
    },
  });
};
