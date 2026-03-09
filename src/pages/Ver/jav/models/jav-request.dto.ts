import { ContentStatus } from '@/common/enums/ver.enum';

export interface CreateJavDto {
  code: string;
  actressIds?: number[]; // IDs de actrices
  actressName?: string; // Nombre de la actriz (el backend la busca o crea) - legacy
  actressUrl?: string; // URL de la actriz (opcional, puede ser nulo) - legacy
  tagIds?: number[]; // IDs de tags
  image: string;
  status?: ContentStatus; // Opcional en create, el backend lo asigna por defecto
  links?: string[]; // Lista de enlaces
}

export interface UpdateJavDto {
  code: string;
  actressIds?: number[];
  tagIds?: number[];
  image: string;
  links?: string[];
}
