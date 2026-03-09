import { useMutation, useQueryClient } from '@tanstack/react-query';
import { girlGaleryService } from '../services/girl.service';
import type { UpdateGirlDto } from '../models/girl-request.dto';

export const useUpdateGirl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGirlDto }) =>
      girlGaleryService.update(id, { name: data.name || '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['girls'] });
    },
  });
};
