import { setAccount } from '@/redux/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });
const GoogleCallback = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch(`http://localhost:8000/api/auth/callback${location.search}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.type === 'success') {
          dispatch(setAccount(data.user));
          cookies.set('access_token', data.access_token);
          cookies.set('refresh_token', data.refresh_token);
          navigate('/');
        }
      });
  }, [location]);

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      {loading && <Spin />}
    </div>
  );
};

export default GoogleCallback;
