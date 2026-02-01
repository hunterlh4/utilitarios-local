import { Anime } from './anime.model';

export interface GetAllAnimeResponse {
  data: Anime[];
  total: number;
}

export interface GetAnimeByIdResponse {
  data: Anime;
}
