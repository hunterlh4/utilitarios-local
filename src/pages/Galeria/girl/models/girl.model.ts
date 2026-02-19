export interface GirlGalery {
  id: number;
  name: string;
  firstImageUrl?: string;
  createdAt?: string;
}

export interface GirlGaleryDetail {
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

export interface UpdateGirlGaleryDto {
  name: string;
  mediaId?: number;
}
