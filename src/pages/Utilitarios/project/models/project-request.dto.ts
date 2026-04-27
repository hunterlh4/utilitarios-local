export interface CreateProjectDto {
  name: string;
  description?: string;
  url?: string;
  tagIds?: number[];
  links?: string[];
}

export interface UpdateProjectDto {
  name: string;
  description?: string;
  url?: string;
  tagIds?: number[];
}
