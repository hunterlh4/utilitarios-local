export interface AnimeGalery {
  id: number;
  name: string;
  firstImageUrl?: string;
  createdAt?: string;
}

export interface AnimeGaleryDetail {
  id: number;
  name: string;
  media: Media[];
  createdAt: string;
}

export interface Media {
  id: number;
  url: string;
  thumbnail?: string;
  orderIndex: number;
}

export interface UpdateAnimeGaleryDto {
  name: string;
  mediaId?: number;
}
