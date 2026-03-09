import type { AnimeGalery } from './anime-galery.model';

export interface GetAllAnimeGaleryResponse {
  data: AnimeGalery[];
  total: number;
}

export interface GetAnimeGaleryByIdResponse {
  data: AnimeGalery;
}
