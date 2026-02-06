import { ContentStatus } from '@/common/enums/ver.enum';

export interface Series {
  id: number;
  imdbId: string;
  title: string;
  image: string;
  year?: number;
  rating?: number;
  type?: string;
  status: ContentStatus;
  createdAt?: string;
}
