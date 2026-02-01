export interface Series {
  id: number;
  imdbId: string;
  title: string;
  image: string;
  year?: number;
  rating?: number;
  type?: string;
  status: '1' | '2'; // 1: proximamente, 2: completado
  createdAt: string;
}
