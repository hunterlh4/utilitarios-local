import { useMutation, useQueryClient } from '@tanstack/react-query';
import { steamItemService } from '../services/steam-item.service';
import { CreateSteamItemDto } from '../models/steam-item-request.dto';

export const useAddSteamItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSteamItemDto) => steamItemService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steam-items'] });
    },
  });
};
