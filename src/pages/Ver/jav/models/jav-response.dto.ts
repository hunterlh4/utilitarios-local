import { Jav } from './jav.model';

export interface GetAllJavResponse {
  data: Jav[];
  total: number;
}

export interface GetJavByIdResponse {
  data: Jav;
}
