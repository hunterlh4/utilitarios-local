import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, actressIds, tagIds }: { videoId: number; actressIds: number[]; tagIds: number[] }) =>
      actressAdultService.updateVideo(videoId, actressIds, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdultDetail'] });
    },
  });
};
