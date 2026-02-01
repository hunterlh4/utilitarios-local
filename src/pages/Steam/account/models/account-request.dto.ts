export interface CreateAccountDto {
  type: '1' | '2' | '3' | '4' | '5' | '6';
  name: string;
  username?: string;
  password?: string;
  profileUrl?: string;
  phoneNumber?: string;
  recoveryEmail?: string;
  lastConnection?: string;
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {}
