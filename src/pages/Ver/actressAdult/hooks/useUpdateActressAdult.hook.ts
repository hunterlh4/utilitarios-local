import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useUpdateActressAdult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      actressAdultService.update(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
    },
  });
};
