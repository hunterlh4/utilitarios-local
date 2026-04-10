export interface SteamItemRef {
  id: number;
  name: string;
  image: string;
  marketUrl: string;
  game?: 1 | 2;
}

export interface SteamItemPurchase {
  id: number;
  purchasePrice: number;
  salePrice: number;
  profit?: number;
  status: 1 | 2; // 1: comprado, 2: vendido
  createdAt: string;
  item: SteamItemRef;
}
