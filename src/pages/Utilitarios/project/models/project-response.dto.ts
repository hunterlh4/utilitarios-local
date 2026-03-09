import type { Proyect } from './project.model';

export interface GetAllProyectsResponse {
  data: Proyect[];
  total: number;
}

export interface GetProyectByIdResponse {
  data: Proyect;
}
