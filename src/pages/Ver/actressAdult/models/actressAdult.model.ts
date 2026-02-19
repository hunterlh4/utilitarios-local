export interface ActressAdult {
  id: number;
  name: string;
  firstImageUrl?: string;
  createdAt?: string;
}

export interface ActressAdultDetail {
  id: number;
  name: string;
  videos: VideoAdult[];
}

export interface VideoAdult {
  id: number;
  source: string;
  videoUrl: string;
  title?: string;
  thumbnailUrl?: string;
  actresses: ActressSimple[];
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
}
