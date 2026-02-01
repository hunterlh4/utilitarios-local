// Tipos de cuenta (Account table)
export enum AccountType {
  Email = 1,
  Steam = 2,
  Facebook = 3,
  Instagram = 4,
  Game = 5,
  Other = 6,
}

// Propiedades de cuenta (AccountProperty table)
export enum AccountPropertyKey {
  HasDota2 = 1,
  HasCS2 = 2,
  HasSteamMobile = 3,
  VacBanned = 4,
}
