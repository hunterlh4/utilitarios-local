import { useMutation, useQueryClient } from '@tanstack/react-query';
import { girlGaleryService } from '../services/girl.service';
import type { CreateGirlDto } from '../models/girl-request.dto';

export const useAddGirl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGirlDto) => girlGaleryService.create(data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['girls'] });
    },
  });
};
