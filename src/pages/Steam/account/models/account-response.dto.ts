import { Account } from './account.model';

export interface GetAllAccountsResponse {
  data: Account[];
  total: number;
}

export interface GetAccountByIdResponse {
  data: Account;
}
