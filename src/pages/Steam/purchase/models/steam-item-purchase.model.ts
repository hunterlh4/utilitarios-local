export interface SteamItemPurchase {
  id: number;
  steamItemId: number;
  purchasePrice: number;
  salePrice: number;
  profit?: number;
  status: '1' | '2'; // 1: comprado, 2: vendido
  purchaseDate: string;
  saleDate?: string;
  createdAt: string;
}
