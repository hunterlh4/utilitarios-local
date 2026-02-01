export interface CreateProyectDto {
  name: string;
  description?: string;
  url?: string;
}

export interface UpdateProyectDto extends Partial<CreateProyectDto> {}
