import { Payment } from './payment.model';

export interface GetAllPaymentsResponse {
  data: Payment[];
  total: number;
}

export interface GetPaymentByIdResponse {
  data: Payment;
}
