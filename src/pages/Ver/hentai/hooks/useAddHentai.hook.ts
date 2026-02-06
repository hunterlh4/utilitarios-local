import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hentaiService } from '../services/hentai.service';
import { CreateHentaiDto } from '../models/hentai-request.dto';

export const useAddHentai = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHentaiDto) => hentaiService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hentai'] });
    },
  });
};
