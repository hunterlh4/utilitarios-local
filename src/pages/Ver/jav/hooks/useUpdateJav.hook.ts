import { useMutation, useQueryClient } from '@tanstack/react-query';
import { javService } from '../services/jav.service';
import type { UpdateJavDto } from '../models/jav-request.dto';

export const useUpdateJav = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateJavDto }) =>
      javService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jav'] });
    },
  });
};
