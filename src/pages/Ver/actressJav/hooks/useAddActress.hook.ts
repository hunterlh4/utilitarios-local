import { useMutation, useQueryClient } from '@tantml:query';
import { actressJavService } from '../services/actressJav.service';
import { CreateActressDto } from '../models/actress-request.dto';

export const useAddActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActressDto) => actressJavService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
  });
};
