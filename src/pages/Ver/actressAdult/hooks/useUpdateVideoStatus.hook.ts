import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/config/api/api-client';

export const useUpdateVideoStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      apiClient.put(`/actress-adult/video/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdultVideos'] });
    },
  });
};
