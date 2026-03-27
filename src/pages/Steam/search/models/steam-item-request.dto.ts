export interface CreateSteamItemDto {
  externalId?: string;
  name: string;
  image: string;
  price?: number;
  game: '1' | '2';
  marketUrl: string;
  status: '1' | '2';
}

export interface UpdateSteamItemDto extends Partial<CreateSteamItemDto> {}
