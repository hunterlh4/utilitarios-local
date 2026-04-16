import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { girlGaleryService } from '../services/girl.service';

export const useDeleteGirlGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => girlGaleryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['girlGalery'] });
      toast.success('Galería eliminada correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar la galería');
    },
  });
};
