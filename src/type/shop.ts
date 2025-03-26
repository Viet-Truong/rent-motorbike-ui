export type Shop = {
  shop_id?: number;
  name: string;
  email: string;
  address: string;
  full_address?: string;
  phone_number: string;
  owner_id?: number;
  status?: string;
  wards_id: number;
  district_id?: number;
  city_id?: number;
};

export type Position = {
  lat: number;
  lng: number;
  name: string;
  address?: string;
  isCurrent?: boolean;
};

export type ListShop = {
  shop_id: number;
  name: string;
  email: string;
  full_address: string;
  phone_number: string;
  owner_id?: number;
  status: string;
  image?: string;
};
