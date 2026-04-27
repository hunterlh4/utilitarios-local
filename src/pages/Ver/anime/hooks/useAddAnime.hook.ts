import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animeService } from '../services/anime.service';
import type { CreateAnimeDto } from '../models/anime-request.dto';
import { toast } from 'sonner';

export const useAddAnime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnimeDto) => animeService.create(data),
    onSuccess: () => {
      toast.success('Anime guardado correctamente');
      queryClient.invalidateQueries({ queryKey: ['anime'] });
    },
  });
};
