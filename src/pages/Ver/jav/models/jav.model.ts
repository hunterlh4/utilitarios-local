export interface Jav {
  id: number;
  code: string;
  actressId?: number;
  image: string;
  status: '1' | '2'; // 1: proximamente, 2: completado
  createdAt: string;
}
