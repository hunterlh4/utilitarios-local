import { Seller } from './seller.model';

export interface GetAllSellersResponse {
  data: Seller[];
  total: number;
}

export interface GetSellerByIdResponse {
  data: Seller;
}
