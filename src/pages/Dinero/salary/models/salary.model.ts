export interface Salary {
  id: number;
  currentMoney?: number;
  grossSalary: number;
  afpDiscount: number;
  firstFortnightNet: number;
  secondFortnightNet: number;
  cts?: number;
  bonus?: number;
  createdAt: string;
}
