import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';
import { toast } from 'sonner';

export const useCreateActressAdult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, tagIds }: { name: string; tagIds: number[] }) => 
      actressAdultService.create(name, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
      toast.success('Actriz creada correctamente');
    },
    onError: (error: unknown) => {
      const maybeApiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage = maybeApiError.response?.data?.message || maybeApiError.message;
      toast.error(errorMessage && errorMessage.includes('Ya existe') ? errorMessage : 'Error al crear la actriz');
    },
  });
};
