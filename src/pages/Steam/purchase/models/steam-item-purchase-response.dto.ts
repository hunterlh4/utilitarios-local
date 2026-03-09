import type { SteamItemPurchase } from './steam-item-purchase.model';

export interface GetAllSteamItemPurchasesResponse {
  data: SteamItemPurchase[];
  total: number;
}

export interface GetSteamItemPurchaseByIdResponse {
  data: SteamItemPurchase;
}
