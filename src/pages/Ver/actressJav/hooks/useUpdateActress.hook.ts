import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';
import type { UpdateActressDto } from '../models/actress-request.dto';

export const useUpdateActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateActressDto }) =>
      actressJavService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
  });
};
