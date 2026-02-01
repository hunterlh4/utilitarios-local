export interface Payment {
  id: number;
  personId: number;
  type: '1' | '2' | '3' | '4'; // 1: deuda, 2: pago, 3: interes_deuda, 4: interes_pago
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
}
