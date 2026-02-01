export interface CreateSteamItemDropDto {
  steamItemId: number;
  quantity: number;
  price: number;
  salePrice: number;
  total: number;
}

export interface UpdateSteamItemDropDto extends Partial<CreateSteamItemDropDto> {}
