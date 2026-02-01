import { useMutation, useQueryClient } from '@tanstack/react-query';
import { steamItemService } from '../services/steam-item.service';
import { UpdateSteamItemDto } from '../models/steam-item-request.dto';

export const useUpdateSteamItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSteamItemDto }) =>
      steamItemService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steam-items'] });
    },
  });
};
