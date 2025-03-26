import { Shop } from './shop';

export type FormMotorbikeData = {
  motorbike_id?: number;
  motorbike_name: string;
  brand: string;
  status: string;
  motorbike_license_plates: string;
  motorbike_type: string;
  rent_cost: number;
  slug: string;
  description: string;
  shop_id: number;
  images: string[];
};

export type Motorbike = {
  violation_id?: number;
  motorbike_id: number;
  motorbike_name: string;
  brand: string;
  status: string;
  motorbike_license_plates: string;
  motorbike_type: string;
  rent_cost: number;
  slug: string;
  description: string;
  condition: string;
  shop?: Shop;
  images: string[] | [];
  calendar: {
    start_date: string;
    end_date: string;
  }[];
  violation_price?: string;
  violation_type?: string;
  evaluate?: number;
};

export type Evaluate = {
  evaluate_id: number;
  motorbike_id: number;
  user_id: number;
  fullName: string;
  title: string;
  content: string;
  star: number;
  inPrivate: boolean;
  created_at: string;
};
