import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressService } from '../services/actress.service';
import { UpdateActressDto } from '../models/actress-request.dto';

export const useUpdateActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateActressDto }) =>
      actressService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
  });
};
