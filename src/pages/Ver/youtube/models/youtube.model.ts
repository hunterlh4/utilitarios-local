export interface YouTube {
  id: number;
  url: string;
  title: string;
  authorName?: string;
  authorUrl?: string;
  type?: string;
  height?: number;
  width?: number;
  version?: string;
  providerName?: string;
  providerUrl?: string;
  thumbnailHeight?: number;
  thumbnailWidth?: number;
  thumbnailUrl?: string;
  html?: string;
  category: '1' | '2' | '3' | '4'; // 1: anime, 2: serie, 3: pelicula, 4: shorts
  createdAt: string;
}
