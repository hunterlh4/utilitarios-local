import { Actress } from './actress.model';

export interface GetAllActressesResponse {
  data: Actress[];
  total: number;
}

export interface GetActressByIdResponse {
  data: Actress;
}
