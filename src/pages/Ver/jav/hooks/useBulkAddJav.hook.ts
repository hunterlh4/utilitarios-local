import { useMutation, useQueryClient } from '@tanstack/react-query';
import { javService } from '../services/jav.service';
import type { Jav } from '../services/javs';

const timestampToDate = (ts?: number): string | undefined => {
  if (!ts) return undefined;
  return new Date(ts).toISOString();
};

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
            createdAt: timestampToDate(jav.timestamp),
          });
          created++;
        } catch {
          skipped++;
        }
      }

      return { created, skipped, failed };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jav'] });
      queryClient.invalidateQueries({ queryKey: ['actresses'] });
    },
  });
};
