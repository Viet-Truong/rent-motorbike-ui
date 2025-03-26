import { request } from '@/utils/request';

export const payment = async ({
  order_id,
  price,
  invoice_id,
}: {
  order_id: number;
  price: number;
  invoice_id: number;
}) => {
  try {
    const res = await request.post('payment', { order_id, price, invoice_id });
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const confirmPayment = async ({
  invoice_id,
  payment_type,
  pay_date,
  status,
}: {
  invoice_id: number;
  payment_type: string;
  pay_date: string;
  status: string;
}) => {
  try {
    const res = await request.post('confirmPayment', {
      invoice_id,
      payment_type,
      pay_date,
      status,
    });
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
