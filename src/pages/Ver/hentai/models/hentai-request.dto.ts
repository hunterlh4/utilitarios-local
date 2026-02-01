import { ContentStatus } from '@/common/enums/ver.enum';

export interface CreateHentaiRequest {
  title: string;
  image: string;
  episodes: number;
  status: ContentStatus;
}

export interface UpdateHentaiRequest {
  title?: string;
  image?: string;
  episodes?: number;
  status?: ContentStatus;
}

export interface GetHentaiListRequest {
  page?: number;
  limit?: number;
  status?: ContentStatus;
  search?: string;
}
