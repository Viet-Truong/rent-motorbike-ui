import { request } from '@/utils/request';

export const getAllShopApprove = async () => {
  try {
    const res = await request.post('getShopApprove', {});
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const getAllShop = async (q: string) => {
  try {
    const res = await request.post('getAllShop', {
      q,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const approveShop = async ({ shop_id }: { shop_id: number }) => {
  try {
    const res = await request.post(`approveShop`, {
      shop_id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const cancelShop = async ({
  shop_id,
  note = 'Không hoàn thành',
}: {
  shop_id: number;
  note?: string;
}) => {
  try {
    const res = await request.post(`cancelShop`, {
      shop_id,
      note,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
