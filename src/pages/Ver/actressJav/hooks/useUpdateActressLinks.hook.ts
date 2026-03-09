import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressJavService } from '../services/actressJav.service';

export const useUpdateActressLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, links }: { id: number; links: string[] }) =>
      actressJavService.updateLinks(id, links),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
  });
};
