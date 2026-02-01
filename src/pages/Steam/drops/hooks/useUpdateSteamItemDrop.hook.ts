import { useMutation, useQueryClient } from '@tanstack/react-query';
import { steamItemDropService } from '../services/steam-item-drop.service';
import { UpdateSteamItemDropDto } from '../models/steam-item-drop-request.dto';

export const useUpdateSteamItemDrop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSteamItemDropDto }) =>
      steamItemDropService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steam-item-drops'] });
    },
  });
};
