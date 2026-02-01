export interface CreateGirlDto {
  name: string;
}

export interface UpdateGirlDto extends Partial<CreateGirlDto> {}
