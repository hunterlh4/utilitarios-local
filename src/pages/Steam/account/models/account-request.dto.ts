import type { AccountType } from '../enums/account.enum';

export interface CreateAccountDto {
  type: AccountType;
  name: string;
  username?: string;
  password?: string;
  profileUrl?: string;
  phoneNumber?: string;
  recoveryEmail?: string;
  lastConnection?: string;
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {}
