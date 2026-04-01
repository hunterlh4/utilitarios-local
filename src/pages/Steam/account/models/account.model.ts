export enum GeneralPlatform { Facebook = 1, Instagram = 2, Rakion = 3, LOL = 4, Other = 5 }
export enum LinkedAccountType { Email = 1, GitHub = 2 }

export const GeneralPlatformLabels: Record<GeneralPlatform, string> = {
  [GeneralPlatform.Facebook]: 'Facebook',
  [GeneralPlatform.Instagram]: 'Instagram',
  [GeneralPlatform.Rakion]: 'Rakion',
  [GeneralPlatform.LOL]: 'LOL',
  [GeneralPlatform.Other]: 'Otro',
};

export interface AccountEmail {
  id: number; provider: string; email: string; password: string;
  phone?: string; recoveryEmail?: string; isNew: boolean; lastUsed?: string; createdAt: string;
}

export interface AccountSteam {
  id: number; emailId: number; emailAddress: string; username: string; password: string;
  phone?: string; profileUrl?: string;
  hasDota2: boolean; hasCS2: boolean; isUnlimited: boolean; isVacBanned: boolean;
  isNew: boolean; lastUsed?: string; createdAt: string;
}

export interface AccountGitHub {
  id: number; emailId: number; emailAddress: string; username: string; password: string;
  profileUrl?: string; isNew: boolean; lastUsed?: string; createdAt: string;
}

export interface AccountGeneral {
  id: number; platform: GeneralPlatform; username: string; password: string;
  emailId?: number; emailAddress?: string; profileUrl?: string; createdAt: string;
}

export interface AccountKiro {
  id: number; linkedType: LinkedAccountType; refId: number; linkedDisplay: string;
  isNew: boolean; lastUsed?: string; createdAt: string;
}

export interface AccountAll {
  emails: AccountEmail[];
  steams: AccountSteam[];
  gitHubs: AccountGitHub[];
  generals: AccountGeneral[];
  kiro?: AccountKiro;
}
