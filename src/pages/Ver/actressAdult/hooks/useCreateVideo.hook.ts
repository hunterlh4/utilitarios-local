import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';
import type { CreateVideoAdultDto } from '../models/actressAdult.model';

export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVideoAdultDto) => actressAdultService.createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdultVideos'] });
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
      queryClient.invalidateQueries({ queryKey: ['actressAdultDetail'] });
    },
  });
};
