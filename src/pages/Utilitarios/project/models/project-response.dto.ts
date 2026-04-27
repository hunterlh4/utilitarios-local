import type { Project } from './project.model';

export interface GetAllProjectsResponse {
  data: Project[];
  total: number;
}

export interface GetProjectByIdResponse {
  data: Project;
}
