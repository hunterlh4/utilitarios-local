import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';
import type { UpdateActressDto } from '../models/actress-request.dto';
import { toast } from 'sonner';

export const useUpdateActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateActressDto }) =>
      actressJavService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
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
