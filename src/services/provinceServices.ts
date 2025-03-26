import { request } from '@/utils/request';

export const getCities = async () => {
  try {
    const res = await request.get('cities');
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const getDistricts = async (cities_id: number) => {
  try {
    const res = await request.get(`cities/${cities_id}/districts`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const getWards = async (districts_id: number) => {
  try {
    const res = await request.get(`districts/${districts_id}/wards`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};
