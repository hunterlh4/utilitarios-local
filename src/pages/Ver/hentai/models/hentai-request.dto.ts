import { ContentStatus } from '@/common/enums/ver.enum';

export interface CreateHentaiDto {
  apiId: string; // Cambiar a string para que coincida con el backend
  title: string;
  image: string;
  episodes: number;
  status: ContentStatus;
}

export interface UpdateHentaiDto extends Partial<CreateHentaiDto> {}
