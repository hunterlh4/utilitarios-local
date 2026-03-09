export interface CreateSeriesDto {
  imdbId: string;
  title: string;
  image: string;
  year?: number;
  rating?: number;
  type?: string;
}

export interface UpdateSeriesDto extends Partial<CreateSeriesDto> {}
