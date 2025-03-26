import classNames from 'classnames/bind';
import styles from '@/scss/pages/user/productDetail.module.scss';
import { useEffect, useState } from 'react';
import {
  Tabs,
  DatePicker,
  notification,
  Button,
  Carousel,
  Divider,
  Spin,
  Image,
  Rate,
  Row,
  Col,
  Input,
  Form,
  Switch,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { addCartItem } from '@/redux/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import * as motorbikeServices from '@/services/motorbikeServices';
import { Evaluate, Motorbike } from '@/type/motorbike';
import CommentItem from '@/components/commentItem';
import noImage from '@/assets/images/noImage.jpg';
import MotorbikeCard from '@/components/motorbikeCard';
import Policy from '@/components/policy';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
const cx = classNames.bind(styles);

const ProductDetail = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.auth);
  const [form] = Form.useForm();
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [isDown, setIsDown] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const location = useLocation();
  const slug = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
  const [motorbike, setMotorbike] = useState<Motorbike>();
  const [suggest, setSuggest] = useState<Motorbike[]>();
  const [evaluates, setEvaluates] = useState<Evaluate[]>();
  const [inPrivate, setInPrivate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const config = {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 9,
  };
  const price = new Intl.NumberFormat('vi-VN', config).format(motorbike?.rent_cost ?? 0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDown(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown) {
      return;
    } else {
      e.preventDefault();
      const x = e.pageX - e.currentTarget.offsetLeft;
      const y = (x - startX) * 1;
      e.currentTarget.scrollLeft = scrollLeft - y;
    }
  };

  const getAllEvaluateByMotorbikeId = async (motorbike_id: number) => {
    const evaluate = await motorbikeServices.getAllEvaluateByMotorbikeId(motorbike_id);
    setEvaluates(evaluate.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await motorbikeServices.getMotorbikeBySlug(slug);
      if (result) {
        setMotorbike(result.data);
        getAllEvaluateByMotorbikeId(result.data.motorbike_id);
      }
    };
    fetchData();
  }, [slug, api]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const res = await motorbikeServices.getSuggestMotorbike(
          position.coords.latitude,
          position.coords.longitude
        );
        if (res.type === 'success') setSuggest(res.data);
      });
    } else {
      console.log('Geolocation is not available in your browser.');
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (motorbike === undefined) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin />
      </div>
    );
  }

  if (evaluates === undefined) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin />
      </div>
    );
  }

  const onFinish = async () => {
    try {
      setLoading(true);
      const res = await motorbikeServices.evaluate({
        motorbike_id: motorbike.motorbike_id,
        user_id: user.user_id,
        title: form.getFieldValue('title'),
        content: form.getFieldValue('content'),
        star: form.getFieldValue('star'),
        inPrivate,
      });

      if (res.type === 'success') {
        api['success']({
          message: 'Thành công',
          description: 'Đánh giá thành công.',
        });
        getAllEvaluateByMotorbikeId(motorbike.motorbike_id);
        form.resetFields();
      } else {
        api['error']({
          message: 'Thất bại',
          description: res.message,
        });
      }
    } catch (error) {
      api['error']({
        message: 'Thất bại',
        description: 'Có lỗi xảy ra',
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    api['error']({
      message: 'Thất bại',
      description: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
    });
  };

  const tabs = [
    {
      label: 'Cửa hàng',
      key: '1',
      children: (
        <div className={cx('wrapper_shop')}>
          <div className={cx('shop_header')}>
            <Image src={noImage} alt='logo_shop' width={'100px'} height={'100px'} preview={false} />
            <div className={cx('shop_name')}>
              <h4>{motorbike?.shop?.name}</h4>
              <Rate disabled />
            </div>
          </div>
          <div className={cx('wrapper_info')}>
            <div>
              Địa chỉ: <span>{motorbike?.shop?.address}</span>
            </div>
            <div>
              Số điện thoại: <span>{motorbike?.shop?.phone_number}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Chính sách',
      key: '2',
      children: <Policy />,
    },
    {
      label: 'Đánh giá',
      key: '3',
      children: (
        <div className={cx('wrapper_list_comment')}>
          {evaluates.map((evaluate) => (
            <CommentItem item={evaluate} key={evaluate.evaluate_id} />
          ))}
          <Divider orientation='left'>Viết đánh giá</Divider>
          <Form
            style={{ padding: '0 20px' }}
            initialValues={{}}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row gutter={[16, 16]}>
              <Col span={16}>
                <Form.Item
                  name={'title'}
                  label='Tiêu đề'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tiêu đề',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'star'}
                  label='Số sao'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn số sao',
                    },
                  ]}
                >
                  <Rate></Rate>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name={'content'}
                  label='Nội dung'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập nội dung',
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <div className={cx('action')}>
              <Switch
                checkedChildren='Ẩn danh'
                unCheckedChildren='Không'
                defaultChecked
                style={{ marginRight: '8px' }}
                checked={inPrivate}
                onChange={(checked) => setInPrivate(checked)}
              />
              <Button
                className='ant-btn-customize'
                htmlType='submit'
                disabled={!user}
                loading={loading}
              >
                Đánh giá
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
  ];

  const disabledDate = (current: [string, string]) => {
    if (!current) return false;

    const startDate = dayjs(current[0]);
    const endDate = dayjs(current[1]);

    if (startDate.isSame(endDate, 'day')) {
      return true;
    }

    return motorbike.calendar.some((item) => {
      return (
        startDate.isSameOrBefore(dayjs(item.start_date)) &&
        endDate.isSameOrAfter(dayjs(item.end_date))
      );
    });
  };
  const handleRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (!dates) return;
    const isAnyDisabled = disabledDate(dateStrings);
    if (isAnyDisabled) {
      api.error({
        message: 'Lỗi',
        description: 'Không thể chọn ngày này',
        style: { zIndex: 9999999999 },
        duration: 1.2,
      });
      setValue(null);
    } else {
      setValue(dates);
      const startDate = dates[0]?.format('DD-MM-YYYY');
      const endDate = dates[1]?.format('DD-MM-YYYY');
      setStartDate(startDate);
      setEndDate(endDate);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDateDisabled = (current: any) => {
    const today = moment().startOf('day');
    const date = current.startOf('day');

    if (date <= today) {
      return true;
    }

    for (let i = 0; i < motorbike?.calendar.length; i++) {
      const start = moment(motorbike.calendar[i].start_date, 'YYYY-MM-DD');
      const end = moment(motorbike.calendar[i].end_date, 'YYYY-MM-DD');

      if (date >= start && date <= end) {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      {contextHolder}
      <div className={cx('wrapper')}>
        <div className={cx('wrapper_motorbike_info')}>
          <Carousel draggable>
            {motorbike?.images.map((image) => (
              <div>
                <img src={image} alt='child_image_1' className={cx('child_image')} />
              </div>
            ))}
          </Carousel>
          <div className={cx('motorbike_info')}>
            <h2 className={cx('name')}>{motorbike?.motorbike_name}</h2>
            <p className={cx('description')}>{motorbike?.description}</p>
            <p className={cx('condition')}>Tình trạng xe: {motorbike?.condition}</p>
            <p className={cx('price')}>
              Giá thuê: <span style={{ color: 'var(--primary)' }}>{price} / 1 ngày</span>
            </p>
            <h4 style={{ color: 'var(--gray-color)', marginBottom: '4px' }}>Chọn ngày:</h4>
            <RangePicker
              disabledDate={isDateDisabled}
              onChange={handleRangeChange}
              value={value}
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            />
            <div className={cx('btn_options')}>
              <Button
                className='ant-btn-customize'
                onClick={() => {
                  if (startDate && endDate)
                    dispatch(
                      addCartItem({
                        id: motorbike.motorbike_id,
                        image: motorbike?.images[0],
                        name: motorbike?.motorbike_name,
                        price:
                          motorbike?.rent_cost *
                          (moment(endDate, 'DD-MM-YYYY')?.diff(
                            moment(startDate, 'DD-MM-YYYY'),
                            'days'
                          ) +
                            1),
                        slug: motorbike?.slug,
                        startDate: startDate,
                        endDate: endDate,
                        shop_id: motorbike.shop?.shop_id,
                      })
                    );
                }}
                disabled={motorbike.shop?.owner_id === user?.user_id}
              >
                Giỏ hàng
              </Button>
            </div>
          </div>
        </div>
        <div className={cx('wrapper_motorbike_detail')}>
          <Tabs defaultActiveKey='1' type='card' size={'small'} items={tabs} />
        </div>
        <div className={cx('suggest_motorbike')}>
          <Divider>GỢI Ý</Divider>
          <div
            className={cx('suggest')}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsDown(false)}
            onMouseUp={() => setIsDown(false)}
          >
            {suggest !== undefined ? (
              suggest.map((motorbike, index) => (
                <MotorbikeCard type='suggest' key={index} motorbike={motorbike} />
              ))
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '20vh',
                  width: '100%',
                }}
              >
                <Spin />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
