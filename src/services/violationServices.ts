import { request } from '@/utils/request';

export const addViolation = async ({
  violation_id,
  violationType,
  note,
  price,
  motorbike_id,
}: {
  violation_id: number;
  violationType: string[];
  note: string;
  price: number;
  motorbike_id: number;
}) => {
  try {
    const res = await request.post(
      'addViolation',
      {
        violation_id,
        violationType,
        note,
        price,
        motorbike_id,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
