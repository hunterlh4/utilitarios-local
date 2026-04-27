import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hentaiService } from '../services/hentai.service';
import type { CreateHentaiDto } from '../models/hentai-request.dto';
import { toast } from 'sonner';

export const useAddHentai = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHentaiDto) => hentaiService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hentai'] });
       toast.success('Hentai guardado correctamente');
    },
  });
};
