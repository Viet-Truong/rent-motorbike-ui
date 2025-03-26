import { request } from '@/utils/request';

type User = {
  email: string;
  password: string;
  fullName?: string;
  dob?: string;
};

export const login = async ({ email, password }: User) => {
  try {
    const res = await request.post('login', {
      email,
      password,
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const register = async ({ email, password, fullName, dob }: User) => {
  try {
    const res = await request.post('register', {
      fullName,
      email,
      password,
      dob,
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const verifyToken = async (token: string) => {
  try {
    const res = await request.get(`verify/${token}`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const logout = async () => {
  try {
    const res = await request.post('logout');
    return res.data;
  } catch (e) {
    console.log(e);
  }
};
