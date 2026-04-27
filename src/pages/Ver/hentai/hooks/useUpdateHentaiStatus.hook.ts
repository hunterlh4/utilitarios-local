import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hentaiService } from '../services/hentai.service';
import { toast } from 'sonner';

export const useUpdateHentaiStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      hentaiService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hentai'] });
         toast.success('Estado actualizado correctamente');
    },
  });
};
