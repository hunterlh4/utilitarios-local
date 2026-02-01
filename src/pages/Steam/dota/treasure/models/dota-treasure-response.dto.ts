import { DotaTreasure } from './dota-treasure.model';

export interface GetAllDotaTreasuresResponse {
  data: DotaTreasure[];
  total: number;
}

export interface GetDotaTreasureByIdResponse {
  data: DotaTreasure;
}
