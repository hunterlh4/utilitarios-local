export interface CreatePostDto {
  title: string;
  description?: string;
  category: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
  subcategory?: string;
  slug: string;
  date: string;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}
