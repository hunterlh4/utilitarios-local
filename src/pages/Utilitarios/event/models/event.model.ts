export interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: '1' | '2'; // 1: festivo, 2: personal
  allDay: boolean;
  color?: string;
  createdAt: string;
}
