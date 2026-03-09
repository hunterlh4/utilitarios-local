import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';
import type { CreateActressDto } from '../models/actress-request.dto';

export const useAddActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActressDto) => actressJavService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
  });
};
