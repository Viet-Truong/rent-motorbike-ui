import classNames from 'classnames/bind';
import styles from '@/scss/pages/register.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { LoginOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import * as authServices from '@/services/authServices';
import moment from 'moment';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);
const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async () => {
    try {
      setLoading(true);
      const auth = await authServices.register({
        email: form.getFieldValue('email'),
        password: form.getFieldValue('password'),
        fullName: form.getFieldValue('fullName'),
        dob: dayjs(form.getFieldValue('dob')).format('YYYY-MM-DD'),
      });
      if (auth.type === 'error') {
        api['error']({
          message: 'Thất bại',
          description: auth.message,
        });
      } else {
        api['success']({
          message: 'Thành công',
          description: auth.message,
        });
        navigate('/verify');
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
          name='register'
          form={form}
          initialValues={{}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
          style={{ minWidth: '500px' }}
        >
          <Title level={2} className='text-center'>
            Đăng kí
          </Title>
          <Form.Item
            name='email'
            hasFeedback
            label='Email'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập địa chỉ email.',
              },
              {
                type: 'email',
                message: 'Địa chỉ email của bạn không hợp lệ.',
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

          <Form.Item
            name='confirm password'
            hasFeedback
            label='Xác nhận mật khẩu'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu của bạn.',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Cả hai mật khẩu phải trùng nhau'));
                },
              }),
            ]}
          >
            <Input.Password placeholder='Password' size='large' />
          </Form.Item>

          <Form.Item
            name='fullName'
            hasFeedback
            label='Họ và tên'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên của bạn.',
              },
              {
                // eslint-disable-next-line no-useless-escape
                pattern: /^[^\d!@#$%^&*()_+=\[\]{}|\\:;"'<>,.?\/]{3,30}$/,
                message: 'Vui lòng nhập tên chính xác',
              },
              {
                type: 'string',
                message: 'Vui lòng nhập tên chính xác.',
              },
            ]}
          >
            <Input placeholder='Họ và tên' size='large' />
          </Form.Item>

          <Form.Item
            name='dob'
            hasFeedback
            label='Ngày sinh'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'vui lòng chọn ngày sinh.',
              },
              {
                type: 'date',
                message: 'Ngày sinh không hợp lệ.',
              },
              () => ({
                validator(_, value) {
                  if (value) {
                    const now = moment();
                    const age = moment(now.format('YYYY-MM-DD')).diff(
                      moment(value.format('YYYY-MM-DD')),
                      'years'
                    );
                    if (age < 18) {
                      return Promise.reject(new Error('Bạn phải lớn hơn 18 tuổi.'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              format='DD/MM/YYYY'
              placeholder='Chọn ngày sinh'
              style={{ width: '100%', height: '40px' }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>
                Bạn đã có tài khoản?{' '}
                <Link to={'/login'} style={{ color: 'var(--primary)' }}>
                  Đăng nhập
                </Link>
              </p>
            </div>
          </Form.Item>

          <Button
            style={{ width: '100%' }}
            type='primary'
            htmlType='submit'
            shape='round'
            icon={<LoginOutlined />}
            size='large'
            loading={loading}
          >
            Đăng kí
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Register;
