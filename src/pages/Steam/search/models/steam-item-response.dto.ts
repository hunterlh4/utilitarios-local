import type { SteamItem } from './steam-item.model';

export interface GetAllSteamItemsResponse {
  data: SteamItem[];
  total: number;
}

export interface GetSteamItemByIdResponse {
  data: SteamItem;
}
