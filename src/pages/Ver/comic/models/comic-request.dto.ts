export interface CreateComicDto {
  name: string;
  image: string;
  url: string;
  category: string;
}

export interface UpdateComicDto extends CreateComicDto {}
