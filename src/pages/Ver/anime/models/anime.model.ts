export interface Anime {
  id: number;
  title: string;
  image: string;
  episodes: number;
  status: '1' | '2'; // 1: proximamente, 2: completado
  createdAt: string;
}
