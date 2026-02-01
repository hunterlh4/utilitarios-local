export interface CreateDotaTreasureDto {
  name: string;
  image: string;
  imagePresentation?: string;
  year: number;
  type?: '1' | '2';
}

export interface UpdateDotaTreasureDto extends Partial<CreateDotaTreasureDto> {}
