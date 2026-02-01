export interface Post {
  id: number;
  title: string;
  description?: string;
  category: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
  subcategory?: string;
  slug: string;
  date: string;
  createdAt: string;
}

export interface PostContent {
  id: number;
  postId: number;
  type: '1' | '2' | '3' | '4' | '5'; // 1: titulo, 2: parrafo, 3: codigo, 4: imagen, 5: lista
  text?: string;
  language?: string;
  url?: string;
  alt?: string;
  orderIndex: number;
  createdAt: string;
}

export interface PostContentItem {
  id: number;
  postContentId: number;
  text: string;
  orderIndex: number;
}
