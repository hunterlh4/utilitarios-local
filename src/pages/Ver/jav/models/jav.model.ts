import { ContentStatus } from '@/common/enums/ver.enum';

export interface LinkDto {
  id: number;
  url: string;
}

export interface ActressDto {
  id: number;
  name: string;
  image?: string;
  links: LinkDto[];
}

export interface Jav {
  id: number;
  code: string;
  actress?: ActressDto; // Objeto completo de la actriz
  actresses?: ActressDto[]; // Lista de actrices
  actressName?: string; // Para uso interno en el formulario
  actressUrl?: string; // Para uso interno en el formulario (no viene del backend)
  tags: string[]; // Tags del JAV
  image: string;
  status: ContentStatus;
  links: LinkDto[]; // Array de objetos Link con id y url
  createdAt?: string;
}
