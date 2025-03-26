export type Invoice = {
  invoice_no: string;
  shop: {
    name: string;
    address: string;
    phone_number: string;
    email: string;
  };
  start_date: string;
  end_date: string;
  customer: {
    name: string;
    phone_number: string;
    email: string;
    cccd: string;
  };
  items: Item[];
  total_price: number;
};

export type Item = {
  id: number;
  motorbike_name: string;
  rent_cost: number;
};
