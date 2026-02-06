import { ContentStatus } from '@/common/enums/ver.enum';

export interface Anime {
  id: number;
  apiId: number; // mal_id de MyAnimeList API
  title: string;
  image: string;
  episodes: number;
  status: ContentStatus;
  createdAt: string;
}
