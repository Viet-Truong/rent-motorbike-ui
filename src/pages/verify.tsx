import classNames from 'classnames/bind';
import styles from '@/scss/pages/verify.module.scss';
import { Button, Form, notification } from 'antd';
import { InputOTP } from 'antd-input-otp';
import { useState } from 'react';
import * as authServices from '@/services/authServices';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { register } from '@/redux/auth/authSlice';

const cx = classNames.bind(styles);
const Verify = () => {
  const [form] = Form.useForm();
  const [value, setValue] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async () => {
    if (value) {
      try {
        setLoading(true);
        const response = await authServices.verifyToken(value.join(''));
        if (response.type === 'success') {
          api['success']({
            message: 'Thành công',
            description:
              'Xác thực thành công. Vui lòng vào trang cá nhân để hoàn thành đầy đủ các thông tin.',
          });
          setTimeout(() => {
            dispatch(register(response.user));
            navigate('/user');
          }, 1000);
        } else {
          api['error']({
            message: 'Thất bại',
            description: 'Mã xác thực không đúng.',
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      api['error']({
        message: 'Thất bại',
        description: 'Mã xác thực không được để trống.',
      });
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
        <h2>Xác thực tài khoản</h2>
        <Form name='verify' form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <InputOTP onChange={setValue} value={value} />
          <Button
            className='ant-btn-customize'
            style={{ marginTop: '20px' }}
            htmlType='submit'
            loading={loading}
          >
            Xác thực
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Verify;
