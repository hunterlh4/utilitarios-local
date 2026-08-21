import { useMutation, useQueryClient } from '@tanstack/react-query';
import { javService } from '../services/jav.service';
import { toast } from 'sonner';
import type { Jav } from '../services/javs';

export const useBulkAddJav = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (javs: Jav[]) => {
      let created = 0;
      let skipped = 0;
      let failed = 0;

      for (const jav of javs) {
        try {
          await javService.bulkCreate({
            code: jav.nombre,
            actresses: jav.actriz
              ? [{ name: jav.actriz, url: jav.actrizUrl }]
              : [],
            image: jav.imagen,
            links: jav.enlaces,
          });
          created++;
        } catch {
          skipped++;
        }
      }

      return { created, skipped, failed };
    },
    onSuccess: (result) => {
      const { created, skipped } = result;
      if (created > 0) {
        toast.success(`✅ ${created} JAV${created > 1 ? 's' : ''} creado${created > 1 ? 's' : ''} exitosamente`);
      }
      if (skipped > 0) {
        toast.warning(`⚠️ ${skipped} JAV${skipped > 1 ? 's' : ''} omitido${skipped > 1 ? 's' : ''} (ya existe${skipped > 1 ? 'n' : ''})`);
      }
      queryClient.invalidateQueries({ queryKey: ['jav'] });
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
    onError: (error) => {
      toast.error(`❌ Error al crear JAVs: ${error.message}`);
    },
  });
};
