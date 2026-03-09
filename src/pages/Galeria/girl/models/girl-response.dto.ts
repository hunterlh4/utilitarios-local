import type { GirlGalery } from './girl.model';

export interface GetAllGirlsResponse {
  data: GirlGalery[];
  total: number;
}

export interface GetGirlByIdResponse {
  data: GirlGalery;
}
