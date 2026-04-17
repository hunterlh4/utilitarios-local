import { useMutation, useQueryClient } from '@tanstack/react-query';
import { javService } from '../services/jav.service';
import type { CreateJavDto } from '../models/jav-request.dto';
import { toast } from 'sonner';

export const useAddJav = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJavDto) => javService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jav'] });
      queryClient.invalidateQueries({ queryKey: ['actress-javs'] });
      toast.success('JAV agregado correctamente');
    },
    onError: () => {
      toast.error('Error al agregar JAV');
    },
  });
};
