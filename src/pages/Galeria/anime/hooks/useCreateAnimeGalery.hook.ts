import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { animeGaleryService } from '../services/anime-galery.service';

export const useCreateAnimeGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => animeGaleryService.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animeGalery'] });
      toast.success('Galería creada correctamente');
    },
    onError: () => {
      toast.error('Error al crear la galería');
    },
  });
};
