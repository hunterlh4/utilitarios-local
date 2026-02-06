import { ContentStatus } from '@/common/enums/ver.enum';

export interface CreateJavDto {
  code: string;
  actressName?: string; // Nombre de la actriz (el backend la busca o crea)
  actressUrl?: string; // URL de la actriz (opcional, puede ser nulo)
  image: string;
  status?: ContentStatus; // Opcional en create, el backend lo asigna por defecto
  links?: string[]; // Lista de enlaces
}

export interface UpdateJavDto extends Partial<CreateJavDto> {}
