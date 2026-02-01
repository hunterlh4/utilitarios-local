import type { BaseEntity } from '@/config/models/base.model';
import { ContentStatus } from '@/common/enums/ver.enum';

export interface Hentai extends BaseEntity {
  title: string;
  image: string;
  episodes: number;
  status: ContentStatus;
}
