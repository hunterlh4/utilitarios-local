import type { AccountType, AccountPropertyKey } from '../enums/account.enum';

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
  relations?: AccountRelation[];
  properties?: AccountProperty[];
}

export interface AccountRelation {
  id: number;
  parentAccountId: number;
  childAccountId: number;
  childAccount?: Account;
  createdAt: string;
}

export interface AccountProperty {
  id: number;
  accountId: number;
  key: AccountPropertyKey;
  value: boolean;
  createdAt: string;
}
