export interface SteamItem {
  id: number;
  name: string;
  image: string;
  price?: string;
  game: '1' | '2'; // 1: dota2, 2: cs2
  marketUrl: string;
  status: '1' | '2'; // 1: historial, 2: por_comprar
  createdAt: string;
}
