import { useMutation, useQueryClient } from '@tanstack/react-query';
import { steamItemDropService } from '../services/steam-item-drop.service';
import type { CreateSteamItemDropDto } from '../models/steam-item-drop-request.dto';

export const useAddSteamItemDrop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSteamItemDropDto) => steamItemDropService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steam-item-drops'] });
    },
  });
};
