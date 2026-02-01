import { DotaCache } from './dota-cache.model';

export interface GetAllDotaCachesResponse {
  data: DotaCache[];
  total: number;
}

export interface GetDotaCacheByIdResponse {
  data: DotaCache;
}
