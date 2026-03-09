import { useMutation, useQueryClient } from '@tanstack/react-query';
import { girlService } from '../services/girl.service';
import type { UpdateGirlDto } from '../models/girl-request.dto';

export const useUpdateGirl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGirlDto }) =>
      girlService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['girls'] });
    },
  });
};
