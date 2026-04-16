import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../services/tag.service';

export const useExportTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tagService.exportExcel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};