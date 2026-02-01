import { SteamItemDrop } from './steam-item-drop.model';

export interface GetAllSteamItemDropsResponse {
  data: SteamItemDrop[];
  total: number;
}

export interface GetSteamItemDropByIdResponse {
  data: SteamItemDrop;
}
