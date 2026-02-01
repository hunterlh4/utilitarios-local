export interface CreateAnimeDto {
  title: string;
  image: string;
  episodes: number;
  status: '1' | '2';
}

export interface UpdateAnimeDto extends Partial<CreateAnimeDto> {}
