import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';
import type { CreateActressDto } from '../models/actress-request.dto';
import { toast } from 'sonner';

export const useAddActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActressDto) => actressJavService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
      toast.success('Actriz agregada correctamente');
    },
    onError: (error: unknown) => {
      const maybeApiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage = maybeApiError.response?.data?.message || maybeApiError.message;
      toast.error(errorMessage && errorMessage.includes('Ya existe') ? errorMessage : 'Error al agregar la actriz');
    },
  });
};
