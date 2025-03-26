/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '@/scss/pages/user/registerToBeginShop.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import moment from 'moment';
import dayjs from 'dayjs';
import { InputOTP } from 'antd-input-otp';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Steps,
  notification,
} from 'antd';

import { addNewEmployees } from '@/redux/employee/employeeSlice';
import { City, District, Ward } from '@/type/province';
import { useNavigate } from 'react-router-dom';
import * as shopServices from '@/services/shopServices';
import * as provinceServices from '@/services/provinceServices';
import * as adminServices from '@/services/adminServices';
import { setAuth } from '@/redux/auth/authSlice';

const cx = classNames.bind(styles);

const RegisterToBecomeShop = () => {
  const auth = useAppSelector((state) => state.auth.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [formShop] = Form.useForm();
  const [formEmployee] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [token, setToken] = useState<string[]>();
  const [dob, setDob] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const onChange: DatePickerProps['onChange'] = (dates) => {
    const date = dates.format('YYYY-MM-DD');
    setDob(date);
  };

  useEffect(() => {
    const shopId = localStorage.getItem('shop_id');
    const shop_id = shopId ? +shopId : null;

    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (isDirty && current !== 0) {
        event.preventDefault();
        const confirmLeave = window.confirm(
          'Bạn có chắc chắn muốn rời khỏi trang? Các thay đổi chưa được lưu sẽ bị mất.'
        );
        if (confirmLeave && shop_id) {
          await adminServices.cancelShop({ shop_id });
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, current]);

  useEffect(() => {
    const fetchCities = async () => {
      const res = await provinceServices.getCities();
      if (res)
        setCities(
          res.map((res: City) => {
            return {
              value: res.id,
              label: res.name,
            };
          })
        );
    };

    fetchCities();
  }, []);

  const handleCityChange = async (value: number) => {
    setDistricts([]);
    setWards([]);

    const res = await provinceServices.getDistricts(value);
    if (res)
      setDistricts(
        res.map((res: District) => {
          return {
            value: res.id,
            label: res.name,
          };
        })
      );
  };

  const handleDistrictChange = async (value: number) => {
    setWards([]);
    const res = await provinceServices.getWards(value);
    if (res)
      setWards(
        res.map((res: Ward) => {
          return {
            value: res.id,
            label: res.name,
          };
        })
      );
  };

  const steps = [
    {
      title: 'Bước 1',
      content: (
        <div>
          <Divider orientation='left'>Điền thông tin cửa hàng</Divider>
          <Form
            name='formShop'
            style={{ padding: '0 40px' }}
            initialValues={{
              remember: false,
            }}
            form={formShop}
            autoComplete='off'
            onValuesChange={() => {
              console.log('đã chagne');
              setIsDirty(true);
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item
                  name='name'
                  label='Tên cửa hàng'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên cửa hàng',
                    },
                  ]}
                >
                  <Input placeholder='Tên cửa hàng' size='large' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='email'
                  label='Email'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập email',
                    },
                    {
                      type: 'email',
                      message: 'Vui lòng nhập email hợp lệ.',
                    },
                  ]}
                >
                  <Input placeholder='Email' size='large' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='phone_number'
                  label='Số điện thoại'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập số điện thoại.',
                    },
                    {
                      pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                      message: 'Số điện thoại không hợp lệ.',
                    },
                  ]}
                >
                  <Input placeholder='Số điện thoại' size='large' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]} justify='space-between'>
              <Col span={6}>
                <Form.Item
                  name='address'
                  label='Địa chỉ cụ thể'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập địa chỉ của cửa hàng',
                    },
                  ]}
                >
                  <Input placeholder='Số, đường' size='large' width={100} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='city_id'
                  label='Thành phố'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn thành phố',
                    },
                  ]}
                >
                  <Select
                    placeholder='Chọn thành phố'
                    style={{ width: '100%', height: '40px' }}
                    onChange={(value) => handleCityChange(value)}
                    options={cities ?? []}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='district_id'
                  label='Quận'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn quận',
                    },
                  ]}
                >
                  <Select
                    placeholder='Chọn quận'
                    style={{ width: '100%', height: '40px' }}
                    onChange={(value) => handleDistrictChange(value)}
                    options={districts ?? []}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='wards_id'
                  label='Chọn phường'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn phường',
                    },
                  ]}
                >
                  <Select
                    placeholder='Chọn phường'
                    style={{ width: '100%', height: '40px' }}
                    options={wards ?? []}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
    {
      title: 'Bước 2',
      content: (
        <div>
          <Divider orientation='left'>Nhập thông tin nhân viên</Divider>
          <div className={cx('wrapper_header')}>
            <h4>Vui lòng nhập tối thiểu 1 nhân viên</h4>
            <p style={{ fontSize: '12px', fontStyle: 'italic' }}>
              Mật khẩu mặc định cho nhân viên là:{' '}
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontStyle: 'normal',
                }}
              >
                1234567aA
              </span>
            </p>
          </div>
          <Form
            name='formEmployee'
            form={formEmployee}
            autoComplete='off'
            onValuesChange={() => {
              console.log('đã chagne');
              setIsDirty(true);
            }}
          >
            <Form.List name='users'>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px',
                        borderBottom: '1px solid #ccc',
                      }}
                    >
                      <div style={{ flex: '0 0 95%' }}>
                        <Row gutter={[16, 16]}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'fullName']}
                              label='Họ và tên'
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập tên!',
                                },
                              ]}
                            >
                              <Input placeholder='Tên' />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'email']}
                              label='Email'
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập email!',
                                },
                              ]}
                            >
                              <Input placeholder='Email' />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'phone_number']}
                              label='Số điện thoại'
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập số điện thoại!',
                                },
                                {
                                  pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                  message: 'Số điện thoại không hợp lệ.',
                                },
                              ]}
                            >
                              <Input placeholder='Số điện thoại' />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'card_id']}
                              label='Căn cước'
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập căn cước công dân!',
                                },
                                {
                                  len: 12,
                                  message: 'Vui lòng nhập căn cước công dân!',
                                },
                              ]}
                            >
                              <Input placeholder='Căn cước công dân' />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'address']}
                              label='Địa chỉ'
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập địa chỉ!',
                                },
                              ]}
                            >
                              <Input placeholder='Địa chỉ' />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'gender']}
                              label='Giới tính'
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập giới tính!',
                                },
                              ]}
                            >
                              <Select placeholder='Chọn giới tính'>
                                <Select.Option value='Nam'>Nam</Select.Option>
                                <Select.Option value='Nữ'>Nữ</Select.Option>
                                <Select.Option value='Khác'>Khác</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'dob']}
                              label='Ngày sinh'
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng chọn ngày sinh.',
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
                                        return Promise.reject(new Error('Chưa đủ 18 tuổi.'));
                                      }
                                    }
                                    return Promise.resolve();
                                  },
                                }),
                              ]}
                            >
                              <DatePicker
                                onChange={onChange}
                                format='YYYY-MM-DD'
                                placeholder='Chọn ngày sinh'
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                      <MinusCircleOutlined
                        onClick={() => {
                          if (fields.length > 1) remove(name);
                        }}
                      />
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ marginTop: '8px' }}
                    >
                      Thêm nhân viên
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>
      ),
    },
    {
      title: 'Bước cuối cùng',
      content: (
        <div>
          <Divider orientation='left'>Nhập mã xác thực</Divider>
          <div className={cx('wrapper_header')}></div>
          <div style={{ marginBottom: '20px' }}>
            <InputOTP onChange={setToken} value={token} />
          </div>
        </div>
      ),
    },
  ];

  const next = async (current: number) => {
    if (current === 0) {
      try {
        setLoading(true);
        const response = await shopServices.addShop({
          ...formShop.getFieldsValue(),
          owner_id: auth.user_id,
        });
        const result = response?.data;
        if (result.type === 'success') {
          localStorage.setItem('shop_id', result.shop.shop_id);
          setCurrent(current + 1);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const employees = formEmployee.getFieldValue('users') || [];
        const shop_id = localStorage.getItem('shop_id');
        if (shop_id) {
          employees.forEach((user: any) => {
            dispatch(
              addNewEmployees({
                email: user.email,
                fullName: user.fullName,
                role_id: 3,
                status: 'Hoạt động',
                dob: dob,
                card_id: user.card_id,
                phone_number: user.phone_number,
                address: user.address,
                gender: user.gender,
                shop_id: parseInt(shop_id),
              })
            );
          });
          setCurrent(current + 1);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const verify = async () => {
    try {
      setLoading(true);
      if (token) {
        const response = await shopServices.verifyShop(token?.join(''));
        const result = response?.data;
        if (result.type === 'error') {
          api['error']({
            message: 'Thất bại',
            description: 'Có lỗi xảy ra.',
          });
        } else {
          api['success']({
            message: 'Thành công',
            description: 'Đăng kí thành công.',
          });
          setTimeout(() => {
            dispatch(setAuth(result.user));
            localStorage.removeItem('shop_id');
            navigate('/');
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <div className={cx('wrapper')}>
        <Divider orientation='left'>Đăng kí cho thuê xe</Divider>
        <Steps current={current} items={items} />
        <div className={cx('content')}>{steps[current].content}</div>
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button
              type='primary'
              onClick={() => next(current)}
              loading={loading}
              htmlType='submit'
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type='primary' onClick={verify} loading={loading}>
              Done
            </Button>
          )}
        </div>
      </div>
      {contextHolder}
    </>
  );
};

export default RegisterToBecomeShop;
