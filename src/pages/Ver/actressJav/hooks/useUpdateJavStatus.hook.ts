import { useMutation, useQueryClient } from '@tanstack/react-query';
import { javService } from '@/pages/Ver/jav/services/jav.service';
import { toast } from 'sonner';

const UPCOMING_STATUS = 0;

export const useUpdateJavStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      javService.updateStatus(id, status),
    onMutate: ({ status }) => ({ status }),
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ['actress-javs'] });
      toast.success(
        context?.status !== UPCOMING_STATUS
          ? 'JAV marcado como completado'
          : 'JAV marcado como por ver'
      );
    },
    onError: () => {
      toast.error('Error al actualizar el estado');
    },
  });
};
