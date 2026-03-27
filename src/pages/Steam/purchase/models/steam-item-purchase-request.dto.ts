export interface CreateSteamItemPurchaseDto {
  steamItemId: number;
  purchasePrice: number;
}

export interface UpdateSteamItemPurchaseDto {
  steamItemId: number;
  purchasePrice: number;
  salePrice: number;
}
