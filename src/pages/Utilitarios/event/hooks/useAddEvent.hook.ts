import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/event.service';
import type { CreateEventDto } from '../models/event-request.dto';

export const useAddEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventDto) => eventService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
