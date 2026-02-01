export interface Account {
  id: number;
  type: '1' | '2' | '3' | '4' | '5' | '6'; // 1: Email, 2: Steam, 3: Facebook, 4: Instagram, 5: Game, 6: Other
  name: string;
  username?: string;
  password?: string;
  profileUrl?: string;
  phoneNumber?: string;
  recoveryEmail?: string;
  lastConnection?: string;
  createdAt: string;
}
