import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressService } from '../services/actress.service';
import { CreateActressDto } from '../models/actress-request.dto';

export const useAddActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActressDto) => actressService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
  });
};
