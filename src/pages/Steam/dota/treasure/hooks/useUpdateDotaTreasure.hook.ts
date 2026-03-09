import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dotaTreasureService } from '../services/dota-treasure.service';
import type { UpdateDotaTreasureDto } from '../models/dota-treasure-request.dto';

export const useUpdateDotaTreasure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDotaTreasureDto }) =>
      dotaTreasureService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dota-treasures'] });
    },
  });
};
