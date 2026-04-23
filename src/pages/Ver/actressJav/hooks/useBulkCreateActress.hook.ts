import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { actressJavService } from '../services/actressJav.service';

export const useBulkCreateActress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (names: string[]) => {
      let created = 0;
      let failed = 0;

      for (const name of names) {
        try {
          await actressJavService.create({ name, tagIds: [] });
          created++;
        } catch {
          failed++;
        }
      }

      return { created, failed };
    },
    onSuccess: ({ created, failed }) => {
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
      toast.success(`Creación en lote completada. Creadas: ${created}, Fallidas: ${failed}`);
    },
    onError: () => {
      toast.error('Error al crear las actrices');
    },
  });
};
