import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });
export const request = axios.create({
  baseURL: 'https://rent-motorbike-api-production.up.railway.app/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export const get = async (path: string, options = {}) => {
  try {
    const response = await request.get(path, options);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const post = async (path: string, options = {}) => {
  try {
    const response = await request.post(path, options);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Add a request interceptor
function getCookies() {
  const cookie = document.cookie;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cookies: any = cookie.split(';').reduce((cookies: any, cookie) => {
    const [name, val] = cookie.split('=').map((c) => c.trim());
    cookies[name] = val;
    return cookies;
  }, {});
  return { access_token: cookies?.access_token, refresh_token: cookies?.refresh_token };
}

// Add a response interceptor
request.interceptors.request.use(async (config) => {
  const { access_token } = await getCookies();
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refresh_token } = await getCookies();
        const response = await axios.post('/api/refresh', { refresh_token });
        const data = response.data;
        cookies.set('access_token', data.access_token);
        cookies.set('refresh_token', data.refresh_token);
        // Retry the original request with the new token
        const { access_token } = await getCookies();
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
      }
    }
    return Promise.reject(error);
  }
);
