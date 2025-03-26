import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });

export interface IUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auth: any;
}

const getInitialAuth = () => {
  const authJSON = localStorage.getItem('auth') || localStorage.getItem('auth-google');
  const auth = authJSON ? JSON.parse(authJSON) : null;
  return auth;
};

// Define the initial state using that type
const initialState: IUser = {
  auth: getInitialAuth(),
};

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<IUser>) => {
      state.auth = action.payload;
      localStorage.setItem('auth-google', JSON.stringify(action.payload));
    },
    setAuth: (state, action: PayloadAction<IUser>) => {
      state.auth = action.payload;
      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
    login: (state, action: PayloadAction<IUser>) => {
      state.auth = action.payload;
      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
    register: (state, action: PayloadAction<IUser>) => {
      state.auth = action.payload;
      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.auth = null;
      cookies.remove('access_token');
      cookies.remove('refresh_token');
      if (localStorage.getItem('auth')) localStorage.removeItem('auth');
      else localStorage.removeItem('auth-google');
    },
  },
});

export const { setAccount, setAuth, login, register, logout } = authSlice.actions;

export default authSlice.reducer;
