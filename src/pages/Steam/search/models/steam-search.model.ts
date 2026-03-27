// Respuesta de la Steam Market Search API
export interface SteamSearchResult {
  name: string;
  hash_name: string;
  sell_listings: number;
  sell_price: number; // en centavos de dólar
  sell_price_text: string;
  app_icon: string;
  app_name: string;
  asset_description: {
    appid: number;
    classid: string;
    icon_url: string;
    tradable: number;
    name: string;
    name_color?: string;
    type: string;
    market_name: string;
    market_hash_name: string;
  };
}

export interface SteamSearchResponse {
  success: boolean;
  start: number;
  pagesize: number;
  total_count: number;
  results: SteamSearchResult[];
}
