import { useMutation, useQueryClient } from '@tanstack/react-query';
import { javService } from '../services/jav.service';
import { CreateJavDto } from '../models/jav-request.dto';

export const useAddJav = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJavDto) => javService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jav'] });
    },
  });
};
