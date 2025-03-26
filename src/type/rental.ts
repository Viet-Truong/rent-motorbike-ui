import { Motorbike } from './motorbike';

export type rental = {
  rental_id: number;
  customer_id: number;
  fullName: string;
  phone_number: string;
  email: string;
  card_id: string;
  censor_id: number | null;
  status: string;
  start_date: string;
  end_date: string;
  censorship_date: string | null;
  details: Motorbike[];
  payment_status: string;
  total_price: number;
  shop: string;
};

export type RentalPayload = {
  id_customer: string;
  startDate: string | undefined;
  endDate: string | undefined;
  listMotorbike: number[];
  type: string;
};
