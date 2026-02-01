export interface CreateSeriesDto {
  imdbId: string;
  title: string;
  image: string;
  year?: number;
  rating?: number;
  type?: string;
  status: '1' | '2';
}

export interface UpdateSeriesDto extends Partial<CreateSeriesDto> {}
