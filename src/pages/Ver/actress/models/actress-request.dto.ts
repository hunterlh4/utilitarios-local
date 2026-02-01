export interface CreateActressDto {
  name: string;
  image?: string;
}

export interface UpdateActressDto extends Partial<CreateActressDto> {}
