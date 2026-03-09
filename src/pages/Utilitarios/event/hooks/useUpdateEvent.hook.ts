import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/event.service';
import type { UpdateEventDto } from '../models/event-request.dto';

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventDto }) =>
      eventService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
