export interface AnimeGalery {
  id: number;
  name: string;
  createdAt?: string;
}

export interface Media {
  id: number;
  type: number;
  refId: number;
  url: string;
  thumbnail: string;
  deleteUrl: string;
  orderIndex: number;
  createdAt: string;
}
