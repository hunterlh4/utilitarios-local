export interface AnimeGalery {
  id: number;
  name: string;
  image?: string;
  createdAt?: string;
}

export interface AnimeGaleryDetail {
  id: number;
  name: string;
  image?: string;
  media: Media[];
  links: LinkItem[];
  createdAt: string;
}

export interface LinkItem {
  id: number;
  name?: string;
  url: string;
  orderIndex?: number;
}

export interface Media {
  id: number;
  url: string;
  thumbnail?: string;
  orderIndex: number;
}

export interface UpdateAnimeGaleryDto {
  name: string;
}
