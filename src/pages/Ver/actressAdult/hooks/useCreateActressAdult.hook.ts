import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useCreateActressAdult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => actressAdultService.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
    },
  });
};
