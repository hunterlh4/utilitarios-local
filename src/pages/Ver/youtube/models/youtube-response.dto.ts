import { YouTube } from './youtube.model';

export interface GetAllYouTubeResponse {
  data: YouTube[];
  total: number;
}

export interface GetYouTubeByIdResponse {
  data: YouTube;
}
