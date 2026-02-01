export interface DotaCache {
  id: number;
  treasureId: number;
  heroId: number;
  name: string;
  photo: string;
  price?: number;
  quantity?: number;
  total?: number;
  owner?: string;
  createdAt: string;
}
