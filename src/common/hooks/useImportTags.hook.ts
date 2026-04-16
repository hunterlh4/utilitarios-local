import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '@/common/services/tag.service';

export const useImportTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => tagService.importExcel(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};