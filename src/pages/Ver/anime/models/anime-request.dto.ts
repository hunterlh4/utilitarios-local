import { ContentStatus } from '@/common/enums/ver.enum';

export interface CreateAnimeDto {
  apiId: string; // Cambiar a string para que coincida con el backend
  title: string;
  image: string;
  episodes: number;
  status: ContentStatus;
}

export interface UpdateAnimeDto extends Partial<CreateAnimeDto> {}
