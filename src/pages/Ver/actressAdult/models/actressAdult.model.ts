export interface ActressAdult {
  id: number;
  name: string;
  image?: string;
  tags?: string[];
  links?: Link[];
  createdAt?: string;
}

export interface ActressAdultBasic {
  id: number;
  name: string;
  image?: string;
  tagIds: number[];
}

export interface ActressAdultDetail {
  id: number;
  name: string;
  image?: string;
  createdAt: string;
  tags: string[];
  links: Link[];
  videos: VideoAdult[];
}

export interface Link {
  id: number;
  url: string;
  type?: number;
  orderIndex?: number;
}

export interface VideoAdult {
  id: number;
  source: string;
  videoUrl: string;
  title?: string;
  thumbnailUrl?: string;
  actresses: ActressSimple[];
  tags: string[];
  status?: number; // 0: proximamente, 1: completado (opcional hasta que el backend lo agregue)
  createdAt: string;
}

export interface ActressSimple {
  id: number;
  name: string;
}

export interface CreateVideoAdultDto {
  source: string;
  videoUrl: string;
  actressIds: number[];
  tagIds: number[];
}
