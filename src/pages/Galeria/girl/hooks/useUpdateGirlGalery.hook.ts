import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { girlGaleryService } from '../services/girl.service';
import type { UpdateGirlGaleryDto } from '../models/girl.model';

export const useUpdateGirlGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateGirlGaleryDto }) =>
      girlGaleryService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['girlGalery'] });
      queryClient.invalidateQueries({ queryKey: ['girlGaleryDetail', variables.id] });
      toast.success('Galería actualizada correctamente');
    },
    onError: () => {
      toast.error('Error al actualizar la galería');
    },
  });
};
