import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { animeGaleryService } from '../services/anime-galery.service';

export const useDeleteAnimeGalery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => animeGaleryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animeGalery'] });
      toast.success('Galería eliminada correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar la galería');
    },
  });
};
