export interface CreateSteamItemPurchaseDto {
  steamItemId: number;
  purchasePrice: number;
  salePrice?: number;
  profit?: number;
  status: '1' | '2';
  purchaseDate: string;
  saleDate?: string;
}

export interface UpdateSteamItemPurchaseDto extends Partial<CreateSteamItemPurchaseDto> {}
