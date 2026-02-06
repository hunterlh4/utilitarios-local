import { useMutation, useQueryClient } from '@tanstack/react-query';
import { javService } from '../services/jav.service';
import type { CreateJavDto } from '../models/jav-request.dto';

export const useBulkAddJav = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (javs: CreateJavDto[]) => {
      const results = [];
      
      // Enviar los JAVs uno por uno secuencialmente
      for (const jav of javs) {
        try {
          const result = await javService.create(jav);
          results.push({ success: true, data: result });
        } catch (error) {
          results.push({ success: false, error, code: jav.code });
        }
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jav'] });
    },
  });
};
