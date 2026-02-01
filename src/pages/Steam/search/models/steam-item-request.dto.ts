export interface CreateSteamItemDto {
  name: string;
  image: string;
  price?: string;
  game: '1' | '2';
  marketUrl: string;
  status: '1' | '2';
}

export interface UpdateSteamItemDto extends Partial<CreateSteamItemDto> {}
