import type { Event } from './event.model';

export interface GetAllEventsResponse {
  data: Event[];
  total: number;
}

export interface GetEventByIdResponse {
  data: Event;
}
