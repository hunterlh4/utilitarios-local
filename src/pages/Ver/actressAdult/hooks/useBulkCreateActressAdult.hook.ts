import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { actressAdultService } from '../services/actressAdult.service';

export const useBulkCreateActressAdult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (names: string[]) => {
      let created = 0;
      let failed = 0;

      for (const name of names) {
        try {
          await actressAdultService.create(name, []);
          created++;
        } catch {
          failed++;
        }
      }

      return { created, failed };
    },
    onSuccess: ({ created, failed }) => {
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
      toast.success(`Creacion en lote completada. Creadas: ${created}, Fallidas: ${failed}`);
    },
    onError: () => {
      toast.error('Error al crear las actrices');
    },
  });
};
