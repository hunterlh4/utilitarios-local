import { ContentStatus } from '@/common/enums/ver.enum';

export interface JavActressSummary {
  id: number;
  name: string;
}

export interface JavSummary {
  id: number;
  code: string;
  image: string;
  status: ContentStatus;
  tags: string[];
  actresses: JavActressSummary[];
  links: string[];
}
