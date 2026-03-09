import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dotaTreasureService } from '../services/dota-treasure.service';
import type { CreateDotaTreasureDto } from '../models/dota-treasure-request.dto';

export const useAddDotaTreasure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDotaTreasureDto) => dotaTreasureService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dota-treasures'] });
    },
  });
};
