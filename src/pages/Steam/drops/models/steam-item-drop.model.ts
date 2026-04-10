export interface SteamItemRef {
  id: number;
  name: string;
  image: string;
  marketUrl: string;
  game?: 1 | 2;
}

export interface SteamItemDrop {
  id: number;
  quantity: number;
  price: number;
  salePrice: number;
  total: number;
  createdAt: string;
  item: SteamItemRef;
}
