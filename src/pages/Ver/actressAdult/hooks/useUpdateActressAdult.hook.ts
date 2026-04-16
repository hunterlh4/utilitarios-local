import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';
import { toast } from 'sonner';

export const useUpdateActressAdult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name, tagIds }: { id: number; name: string; tagIds: number[] }) =>
      actressAdultService.update(id, name, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
      toast.success('Actriz actualizada correctamente');
    },
    onError: (error: unknown) => {
      const maybeApiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage = maybeApiError.response?.data?.message || maybeApiError.message;
      toast.error(errorMessage && errorMessage.includes('Ya existe') ? errorMessage : 'Error al actualizar la actriz');
    },
  });
};
