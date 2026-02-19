export enum AccountType {
  Email = '1',
  Steam = '2',
  Facebook = '3',
  Instagram = '4',
  Game = '5',
  Other = '6',
}

export enum AccountPropertyKey {
  HasDota2 = '1',
  HasCS2 = '2',
  HasSteamMobile = '3',
  VacBanned = '4',
  Kiro500 = '5',
  Kiro50 = '6',
}

export const AccountTypeLabels: Record<AccountType, string> = {
  [AccountType.Email]: 'Email',
  [AccountType.Steam]: 'Steam',
  [AccountType.Facebook]: 'Facebook',
  [AccountType.Instagram]: 'Instagram',
  [AccountType.Game]: 'Game',
  [AccountType.Other]: 'Other',
};

export const AccountPropertyLabels: Record<AccountPropertyKey, string> = {
  [AccountPropertyKey.HasDota2]: 'Dota 2',
  [AccountPropertyKey.HasCS2]: 'CS2',
  [AccountPropertyKey.HasSteamMobile]: 'Steam Mobile',
  [AccountPropertyKey.VacBanned]: 'VAC Banned',
  [AccountPropertyKey.Kiro500]: 'Kiro $500',
  [AccountPropertyKey.Kiro50]: 'Kiro $50',
};
