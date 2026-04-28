import type { GeneralPlatform, LinkedAccountType } from './account.model';

export interface CreateEmailDto {
  provider: string;
  email: string;
  password: string;
  phone?: string;
  recoveryEmailId?: number;
}
export interface UpdateEmailDto extends CreateEmailDto {}

export interface CreateSteamDto {
  emailId?: number;
  username: string;
  password: string;
  phone?: string;
  profileUrl?: string;
  imageUrl?: string;
  hasDota2: boolean;
  hasCS2: boolean;
  isUnlimited: boolean;
  isVacBanned: boolean;
  hasSteamMobile: boolean;
  lastPurchaseDate?: string;
}
export interface UpdateSteamDto extends CreateSteamDto {}

export interface CreateGitHubDto {
  emailId?: number;
  username: string;
  password: string;
  profileUrl?: string;
}
export interface UpdateGitHubDto extends CreateGitHubDto {}

export interface CreateGeneralDto {
  platform: GeneralPlatform;
  username: string;
  password: string;
  emailId?: number;
  profileUrl?: string;
}
export interface UpdateGeneralDto extends CreateGeneralDto {}

export interface CreateKiroDto {
  linkedType: LinkedAccountType;
  refId: number;
  isNew: boolean;
  lastUsed?: string;
}
export interface UpdateKiroDto extends CreateKiroDto {}
