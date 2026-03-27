import type { AccountType } from '../enums/account.enum';

export interface AccountProperty {
  id: number;
  accountId: number;
  key: string;
  value: string;
}

export interface AccountRenewal {
  id: number;
  accountId: number;
  day: number;
}

export interface Account {
  id: number;
  type: AccountType;
  name: string;
  username?: string;
  password?: string;
  profileUrl?: string;
  phoneNumber?: string;
  recoveryEmail?: string;
  lastConnection?: string;
  createdAt: string;
  properties: AccountProperty[];
  renewals: AccountRenewal[];
}
