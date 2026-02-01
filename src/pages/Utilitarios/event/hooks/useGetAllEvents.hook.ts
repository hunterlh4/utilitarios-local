import { useQuery } from '@tanstack/react-query';
import { eventService } from '../services/event.service';

export const useGetAllEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAll,
  });
};
