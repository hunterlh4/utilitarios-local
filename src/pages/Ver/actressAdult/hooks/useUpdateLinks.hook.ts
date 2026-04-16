import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';
import { toast } from 'sonner';

export const useUpdateLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, links }: { id: number; links: string[] }) =>
      actressAdultService.updateLinks(id, links),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdultDetail'] });
      toast.success('Links actualizados correctamente');
    },
    onError: () => {
      toast.error('Error al actualizar los links');
    },
  });
};
