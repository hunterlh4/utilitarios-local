export interface ActressLink {
  id: number;
  url: string;
  orderIndex?: number;
}

export interface ActressJav {
  id: number;
  name: string;
  image?: string;
  createdAt: string;
  tags?: string[];
  links?: ActressLink[];
  javCount?: number;
}
