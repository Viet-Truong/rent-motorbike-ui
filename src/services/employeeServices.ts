import { FormUser, User } from '@/type/user';
import { request } from '@/utils/request';

export const addEmployee = async ({
  email,
  fullName,
  role_id,
  status,
  dob,
  card_id,
  phone_number,
  address,
  shop_id,
}: FormUser) => {
  try {
    const res = await request.post('createNewEmployee', {
      email,
      fullName,
      role_id,
      status,
      dob,
      card_id,
      phone_number,
      address,
      shop_id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async ({
  user_id,
  email,
  fullName,
  role_id,
  status,
  dob,
  card_id,
  phone_number,
  address,
  gender,
  avatar,
}: User) => {
  try {
    const res = await request.post('updateProfile', {
      user_id,
      email,
      fullName,
      role_id,
      status,
      dob,
      card_id,
      phone_number,
      address,
      gender,
      avatar,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateAvatar = async ({ user_id, avatar }: { user_id: number; avatar: string }) => {
  try {
    const res = await request.post('updateAvatar', {
      user_id,
      avatar,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const search = async (shop_id: number, value = '') => {
  try {
    const res = await request.post('getAllEmployee', {
      shop_id,
      q: value,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllEmployee = async (shop_id: number) => {
  try {
    const res = await request.post('getAllEmployee', {
      shop_id,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const acceptRentOrder = async ({
  censor_id,
  rental_id,
}: {
  censor_id: number;
  rental_id: number;
}) => {
  try {
    const res = await request.post('confirmOrder', {
      censor_id,
      rental_id,
      status: 'Đã lấy xe',
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const checkoutOrder = async (rental_id: number, censor_id: number) => {
  try {
    const res = await request.post('checkoutOrder', { rental_id, censor_id });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const cancelOrder = async (censor_id: number, rental_id: number, note: string) => {
  try {
    const res = await request.post('cancelOrder', {
      censor_id,
      rental_id,
      note,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllOrderByShop = async ({
  status,
  shop_id,
  q = '',
}: {
  status: string;
  shop_id: number;
  q: string;
}) => {
  try {
    const res = await request.post('getAllOrderByShop', {
      status,
      shop_id,
      q,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAllOrderByUserId = async (user_id: number) => {
  try {
    const res = await request.post('getAllOrderByUserId', {
      user_id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getOrderById = async (rental_id: number) => {
  try {
    const res = await request.post('getOrderbyId', {
      rental_id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const lockAccount = async (user_id: number, status: string) => {
  try {
    const res = await request.post('lockAccount', {
      user_id,
      status,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
