import { DotaHero } from './dota-hero.model';

export interface GetAllDotaHeroesResponse {
  data: DotaHero[];
  total: number;
}

export interface GetDotaHeroByIdResponse {
  data: DotaHero;
}
