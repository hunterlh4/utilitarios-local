import { useMutation, useQueryClient } from '@tanstack/react-query';
import { girlService } from '../services/girl.service';
import { CreateGirlDto } from '../models/girl-request.dto';

export const useAddGirl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGirlDto) => girlService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['girls'] });
    },
  });
};
