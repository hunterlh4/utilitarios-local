export interface CreateSellerDto {
  name?: string;
  whatsapp?: string;
  products?: string;
}

export interface UpdateSellerDto extends Partial<CreateSellerDto> {}
