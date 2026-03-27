export interface SteamItemPurchase {
  id: number;
  steamItemId: number;
  itemName: string;
  itemImage: string;
  itemMarketUrl: string;
  itemGame: 1 | 2; // 1: dota2, 2: cs2
  purchasePrice: number;
  salePrice: number;
  profit?: number;
  status: 1 | 2; // 1: comprado, 2: vendido
  createdAt: string;
}
