import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';
import { toast } from 'sonner';

export const useUpdateActressLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, links }: { id: number; links: string[] }) =>
      actressJavService.updateLinks(id, links),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
      toast.success('Enlaces actualizados correctamente');
    },
    onError: () => {
      toast.error('Error al actualizar los enlaces');
    },
  });
};
