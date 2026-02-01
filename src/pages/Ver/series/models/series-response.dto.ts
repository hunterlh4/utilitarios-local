import { Series } from './series.model';

export interface GetAllSeriesResponse {
  data: Series[];
  total: number;
}

export interface GetSeriesByIdResponse {
  data: Series;
}
