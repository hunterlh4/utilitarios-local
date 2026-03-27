import type { AccountType } from '../enums/account.enum';

export interface AccountPropertyRequest {
  key: string;
  value: string;
}

export interface AccountRenewalRequest {
  day: number;
}

export interface CreateAccountDto {
  type: AccountType;
  name: string;
  username?: string;
  password?: string;
  profileUrl?: string;
  phoneNumber?: string;
  recoveryEmail?: string;
  lastConnection?: string;
  properties?: AccountPropertyRequest[];
  renewals?: AccountRenewalRequest[];
}

export interface UpdateAccountDto extends CreateAccountDto {}
