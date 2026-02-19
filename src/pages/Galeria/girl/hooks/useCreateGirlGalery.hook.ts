import { useMutation, useQueryClient } from '@tanstack/react-query';
import { girlGaleryService } from '../services/girl.service';

export const useCreateGirlGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => girlGaleryService.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['girlGalery'] });
    },
  });
};
