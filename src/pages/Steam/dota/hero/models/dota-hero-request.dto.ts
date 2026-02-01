export interface CreateDotaHeroDto {
  name: string;
  image?: string;
}

export interface UpdateDotaHeroDto extends Partial<CreateDotaHeroDto> {}
