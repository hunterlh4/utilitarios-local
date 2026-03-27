export enum AccountType {
  Email = 1,
  Steam = 2,
  Facebook = 3,
  Instagram = 4,
  Game = 5,
  Other = 6,
  Kiro = 7,
}

export const AccountTypeLabels: Record<AccountType, string> = {
  [AccountType.Email]: 'Email',
  [AccountType.Steam]: 'Steam',
  [AccountType.Facebook]: 'Facebook',
  [AccountType.Instagram]: 'Instagram',
  [AccountType.Game]: 'Game',
  [AccountType.Other]: 'Other',
  [AccountType.Kiro]: 'Kiro',
};

export const AccountTypeColors: Record<AccountType, string> = {
  [AccountType.Email]: 'bg-blue-500/10 text-blue-500',
  [AccountType.Steam]: 'bg-sky-500/10 text-sky-500',
  [AccountType.Facebook]: 'bg-indigo-500/10 text-indigo-500',
  [AccountType.Instagram]: 'bg-pink-500/10 text-pink-500',
  [AccountType.Game]: 'bg-green-500/10 text-green-500',
  [AccountType.Other]: 'bg-muted text-muted-foreground',
  [AccountType.Kiro]: 'bg-purple-500/10 text-purple-500',
};
