export type User = {
  user_id: number;
  email: string;
  fullName: string;
  role_id: string;
  status: string;
  dob: string;
  card_id: string;
  phone_number: string;
  address: string;
  gender: string;
  avatar: string;
  shop_id: number;
};

export type FormUser = {
  email: string;
  fullName: string;
  role_id: number;
  status: string;
  dob: string;
  card_id: string;
  phone_number: string;
  address: string;
  gender?: string;
  shop_id: number;
};
