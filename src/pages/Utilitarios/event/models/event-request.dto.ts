export interface CreateEventDto {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: '1' | '2';
  allDay: boolean;
  color?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}
