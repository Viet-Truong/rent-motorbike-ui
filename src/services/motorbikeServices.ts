import { FormMotorbikeData } from '@/type/motorbike';
import { RentalPayload } from '@/type/rental';
import { request } from '@/utils/request';

export const addMotorbike = async ({
  motorbike_name,
  brand,
  status = 'Hoạt động',
  motorbike_license_plates,
  motorbike_type,
  rent_cost,
  slug,
  description,
  shop_id,
  images,
}: FormMotorbikeData) => {
  try {
    const res = await request.post(
      'createNewMotorbike',
      {
        motorbike_name,
        brand,
        status,
        motorbike_license_plates,
        motorbike_type,
        rent_cost,
        slug,
        description,
        shop_id,
        images,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateMotorbike = async ({
  motorbike_id,
  motorbike_name,
  brand,
  status = 'Hoạt động',
  motorbike_license_plates,
  motorbike_type,
  rent_cost,
  slug,
  description,
  shop_id,
  images,
}: FormMotorbikeData) => {
  try {
    const res = await request.post(
      `update/${motorbike_id}`,
      {
        motorbike_name,
        brand,
        status,
        motorbike_license_plates,
        motorbike_type,
        rent_cost,
        slug,
        description,
        shop_id,
        images,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const search = async (value: string) => {
  try {
    const res = await request.post('getAllMotorbike', {
      q: value,
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const searchAdmin = async (shop_id: number, value: string) => {
  try {
    const res = await request.post('getAllMotorbike', {
      shop_id,
      q: value,
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const getSuggestMotorbike = async (latitude: number, longitude: number) => {
  try {
    const res = await request.post('getSuggestMotorbike', {
      latitude,
      longitude,
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const getAllMotorbike = async () => {
  try {
    const res = await request.post('getAllMotorbike');
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const getAllMotorbikeAdmin = async (shop_id: number) => {
  try {
    const res = await request.post('getAllMotorbike', {
      shop_id,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const getAllMotorbikeByShop = async (shop_id: number) => {
  try {
    const res = await request.post('getAllMotorbike', {
      shop_id,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const getMotorbikeBySlug = async (slug = '') => {
  try {
    const res = await request.get(`getMotorbikeBySlug/${slug}`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const rentMotorbike = async (payload: RentalPayload[]) => {
  try {
    const res = await request.post('rentMotorbike', {
      payload,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const evaluate = async ({
  motorbike_id,
  user_id,
  title,
  content,
  star,
  inPrivate,
}: {
  motorbike_id: number;
  user_id: number;
  title: string;
  content: string;
  star: number;
  inPrivate: boolean;
}) => {
  try {
    const res = await request.post('evaluate', {
      motorbike_id,
      user_id,
      title,
      content,
      star,
      inPrivate,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllEvaluateByMotorbikeId = async (motorbike_id: number) => {
  try {
    const res = await request.post('getAllEvaluateByMotorbikeId', {
      motorbike_id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const lockMotorbike = async (motorbike_id: number, status: string) => {
  try {
    const res = await request.post('lockMotorbike', {
      motorbike_id,
      status,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateConditionMotorbike = async (motorbike_id: number, condition: string) => {
  try {
    const res = await request.post('updateConditionMotorbike', {
      motorbike_id,
      condition,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
