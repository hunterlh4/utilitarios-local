import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { girlGaleryService } from '../services/girl.service';

export const useCreateGirlGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => girlGaleryService.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['girlGalery'] });
      toast.success('Galería creada correctamente');
    },
    onError: () => {
      toast.error('Error al crear la galería');
    },
  });
};
