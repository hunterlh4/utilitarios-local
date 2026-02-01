export interface CreateJavDto {
  code: string;
  actressId?: number;
  image: string;
  status: '1' | '2';
}

export interface UpdateJavDto extends Partial<CreateJavDto> {}
