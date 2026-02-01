export interface CreateAnimeGaleryDto {
  name: string;
}

export interface UpdateAnimeGaleryDto extends Partial<CreateAnimeGaleryDto> {}
