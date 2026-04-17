import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/config/api/api-client';
import { ContentStatus } from '@/common/enums/ver.enum';
import { toast } from 'sonner';

export const useUpdateVideoStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      apiClient.put(`/actress-adult/video/${id}/status`, { status }),
    onMutate: ({ status }) => ({ status }),
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ['actressAdultVideos'] });
      toast.success(context?.status === ContentStatus.Completed ? 'Video marcado como completado' : 'Video marcado como por ver');
    },
    onError: () => {
      toast.error('Error al actualizar el estado');
    },
  });
};
