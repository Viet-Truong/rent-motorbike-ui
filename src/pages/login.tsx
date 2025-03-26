import classNames from 'classnames/bind';
import styles from '@/scss/pages/login.module.scss';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import { GoogleOutlined, LoginOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import * as authServices from '@/services/authServices';
import { login } from '@/redux/auth/authSlice';

const cookies = new Cookies(null, { path: '/' });
const cx = classNames.bind(styles);
const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth.auth);
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState<boolean>(false);

  // Handle login with google
  const [loginUrl, setLoginUrl] = useState('');

  useEffect(() => {
    fetch('https://rent-motorbike-api-production.up.railway.app/api/auth', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong!');
      })
      .then((data) => setLoginUrl(data.url))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (auth === 'verify') {
      navigate('/verify');
    } else if (auth) {
      navigate('/');
    }
  });

  const onFinish = async () => {
    try {
      setLoading(true);
      const auth = await authServices.login({
        email: form.getFieldValue('email'),
        password: form.getFieldValue('password'),
      });
      if (auth.type === 'error') {
        api['error']({
          message: 'Thất bại',
          description: auth.message,
        });
      } else {
        api['success']({
          message: 'Thành công',
          description: 'Đăng nhập thành công.',
        });
        auth &&
          (cookies.set('access_token', auth.access_token),
          cookies.set('refresh_token', auth.refresh_token));
        if (auth?.type === 'verify') {
          navigate('/verify');
        } else {
          dispatch(login(auth.user));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    api['error']({
      message: 'Thất bại',
      description: 'Có lỗi xảy ra. Vui lòng thử lại sau!',
    });
  };
  return (
    <>
      {contextHolder}
      <div className={cx('wrapper')}>
        <Form
          name='login'
          form={form}
          initialValues={{
            remember: false,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
          style={{ minWidth: '500px' }}
        >
          <Title level={2}>Đăng nhập</Title>
          <Form.Item
            name='email'
            hasFeedback
            label='Email'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email của bạn.',
              },
              {
                type: 'email',
                message: 'Email không hợp lệ.',
              },
            ]}
          >
            <Input placeholder='Email' size='large' />
          </Form.Item>
          <Form.Item
            name='password'
            hasFeedback
            label='Mật khẩu'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu của bạn.',
              },
              { min: 8, message: 'Mật khẩu phải có từ 8 kí tự trở lên.' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@#$%^&*()-_=+]{8,}$/,
                message: 'Mật khẩu yêu cầu có ít nhất 1 kí tự thường và 1 kí tự in hoa',
              },
            ]}
          >
            <Input.Password placeholder='Password' size='large' />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>
                Bạn chưa có tài khoản?{' '}
                <Link to={'/register'} style={{ color: 'var(--primary)' }}>
                  Đăng kí
                </Link>
              </p>
              <Link className='login-form-forgot' to='#'>
                Quên mật khẩu ?
              </Link>
            </div>
          </Form.Item>
          <Button
            style={{ width: '100%', marginTop: '20px' }}
            type='primary'
            htmlType='submit'
            shape='round'
            icon={<LoginOutlined />}
            size='large'
            loading={loading}
          >
            Đăng nhập
          </Button>
          <Button
            style={{ width: '100%', marginTop: '20px' }}
            type='primary'
            htmlType='submit'
            shape='round'
            icon={<GoogleOutlined />}
            size='large'
            disabled={loginUrl === '' ? true : false || loading}
            href={loginUrl}
          >
            Đăng nhập với Google
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Login;
