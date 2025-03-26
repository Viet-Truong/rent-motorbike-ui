import { Shop } from '@/type/shop';
import { request } from '@/utils/request';

export const addShop = async ({ name, address, phone_number, owner_id, email, wards_id }: Shop) => {
  try {
    const res = await request.post('createNewShop', {
      name,
      address,
      phone_number,
      email,
      owner_id,
      wards_id,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateShop = async ({
  name,
  address,
  phone_number,
  email,
  shop_id,
  wards_id,
}: Shop) => {
  try {
    const res = await request.post('updateShop', {
      name,
      address,
      phone_number,
      email,
      shop_id,
      wards_id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getShopById = async (shop_id: number) => {
  try {
    const res = await request.post('getShopById', {
      shop_id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const verifyShop = async (token: string) => {
  try {
    const res = await request.get(`verifyShop/${token}`);
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const getStatistic = async (shop_id: number, start_date: string, end_date: string) => {
  try {
    const res = await request.post('getStatistic', {
      shop_id,
      start_date,
      end_date,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTotalAmount = async (shop_id: number) => {
  try {
    const res = await request.post('sumTotalAmount', {
      shop_id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const rentalRatio = async (shop_id: number, start_date: string, end_date: string) => {
  try {
    const res = await request.post('rentalRatio', {
      shop_id,
      start_date,
      end_date,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getShopWithLocation = async () => {
  try {
    const res = await request.get('getAllShopWithLocation');
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getListOwnShop = async (user_id: number) => {
  try {
    const res = await request.post('getShopByUserId', {
      user_id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
