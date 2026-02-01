export interface CreateDotaCacheDto {
  treasureId: number;
  heroId: number;
  name: string;
  photo: string;
  price?: number;
  quantity?: number;
  total?: number;
  owner?: string;
}

export interface UpdateDotaCacheDto extends Partial<CreateDotaCacheDto> {}
