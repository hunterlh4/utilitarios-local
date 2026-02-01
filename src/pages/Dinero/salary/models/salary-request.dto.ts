export interface CreateSalaryDto {
  currentMoney?: number;
  grossSalary: number;
  afpDiscount: number;
  firstFortnightNet: number;
  secondFortnightNet: number;
  cts?: number;
  bonus?: number;
}

export interface UpdateSalaryDto extends Partial<CreateSalaryDto> {}
