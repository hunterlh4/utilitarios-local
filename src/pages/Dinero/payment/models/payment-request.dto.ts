export interface CreatePaymentDto {
  personId: number;
  type: '1' | '2' | '3' | '4';
  amount: number;
  description?: string;
  date: string;
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {}
