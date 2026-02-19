import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actressAdultService } from '../services/actressAdult.service';

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, refId }: { file: File; refId: number }) =>
      actressAdultService.uploadImage(file, refId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['actressAdultDetail', variables.refId] });
      queryClient.invalidateQueries({ queryKey: ['actressAdult'] });
    },
  });
};
