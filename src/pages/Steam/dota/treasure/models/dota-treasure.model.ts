export interface DotaTreasure {
  id: number;
  name: string;
  image: string;
  imagePresentation?: string;
  year: number;
  type?: '1' | '2'; // 1: Treasure I, 2: Treasure II, NULL: sin número
  createdAt: string;
}
