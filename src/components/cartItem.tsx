import {
  DatePicker,
  Image,
  Checkbox,
  Modal,
  Button,
  Radio,
  Space,
  RadioChangeEvent,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import classNames from 'classnames/bind';
import styles from '@/scss/components/cartItem.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  ICart,
  removeCartItem,
  removeItemOfCartItem,
  toggleCartItemChecked,
} from '@/redux/cart/cartSlice';
import * as motorbikeServices from '@/services/motorbikeServices';
import * as paymentServices from '@/services/paymentServices';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RentalPayload } from '@/type/rental';

const cx = classNames.bind(styles);
const { RangePicker } = DatePicker;
const CartItem = ({ setIsOpenCart }: { setIsOpenCart: (isOpen: boolean) => void }) => {
  const { auth } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const dispatch = useAppDispatch();
  const [payment, setPayment] = useState<string>('COD');
  const [api, contextHolderNotification] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleModifyPrice = (price: number) => {
    const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 };
    return new Intl.NumberFormat('vi-VN', config).format(price ?? 0);
  };

  const onChangePayment = (e: RadioChangeEvent) => {
    setPayment(e.target.value);
  };

  const [modal, contextHolder] = Modal.useModal();

  const handleCheckboxChange = (checkboxId: string) => {
    const updatedCheckboxes = cartItems?.map((item) => {
      if (item.id === checkboxId) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    dispatch(toggleCartItemChecked(updatedCheckboxes));
  };

  const totalAmount = cartItems?.reduce((total, item) => {
    if (item.checked) {
      const totalItem = item.data.reduce((total, item) => {
        return total + parseInt(item.price.toString());
      }, 0);
      return total + totalItem;
    }
    return total;
  }, 0);

  const groupByDateAndShop = (items: ICart[]) => {
    const groups = items.reduce<Record<string, ICart[]>>((acc, item) => {
      const key = `${item.date.startDate}-${item.date.endDate}-${item.shop_id}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    return Object.values(groups);
  };

  const handleRentMotorbike = async () => {
    try {
      setLoading(true);
      const rentMotorbike = cartItems?.filter((item) => item.checked);

      if (auth.card_id && auth.dob && auth.phone_number && auth.address) {
        if (rentMotorbike.length > 0) {
          const groupedItems = groupByDateAndShop(rentMotorbike);
          const payloads: RentalPayload[] = groupedItems.map((group) => {
            const startDate = group[0].date.startDate;
            const endDate = group[0].date.endDate;
            const listMotorbike = group.flatMap((item) => item.data.map((i) => i.id));

            return {
              id_customer: auth.user_id,
              startDate,
              endDate,
              listMotorbike,
              type: payment,
            };
          });

          try {
            const response = await motorbikeServices.rentMotorbike(payloads);
            const result = response?.data;

            if (result?.type === 'success') {
              rentMotorbike.forEach((item) => {
                dispatch(removeCartItem({ cartItemId: item.id }));
              });

              if (payment === 'ONL') {
                const paymentResponse = await paymentServices.payment({
                  order_id: result.data.order_id,
                  price: result.data.price,
                  invoice_id: result.data.invoice_id,
                });

                if (paymentResponse.message === 'success') {
                  window.location.href = paymentResponse.data;
                } else {
                  api.error({
                    message: 'Thanh toán thất bại',
                    description: 'Có lỗi xảy ra trong quá trình thanh toán trực tuyến.',
                  });
                }
              } else {
                api.success({
                  message: 'Thành công',
                  description: 'Thuê xe thành công.',
                });

                setIsOpenCart(false);
                navigate('/history');
              }
            } else {
              api.error({
                message: 'Thất bại',
                description: 'Có lỗi xảy ra.',
              });
            }
          } catch (error) {
            api.error({
              message: 'Thất bại',
              description: 'Có lỗi xảy ra trong quá trình thuê xe.',
            });
          }
        }
      } else {
        api.error({
          message: 'Thất bại',
          description: 'Vui lòng cập nhật đầy các thông tin cá nhân trước khi thuê xe!.',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {contextHolderNotification}
      {contextHolder}
      <div className={cx('wrapper')}>
        <div className={cx('cart_items')}>
          {cartItems.map((cartItem) => (
            <div className={cx('cart_item')} key={cartItem.id}>
              <div className={cx('header_item')}>
                <Checkbox
                  checked={cartItem.checked}
                  onChange={() => handleCheckboxChange(cartItem.id)}
                ></Checkbox>
                <RangePicker
                  className={cx('RangePicker')}
                  disabled
                  defaultValue={[
                    dayjs(cartItem.date.startDate, 'DD-MM-YYYY'),
                    dayjs(cartItem.date.endDate, 'DD-MM-YYYY'),
                  ]}
                  format='DD-MMM-YYYY'
                  style={{
                    height: '3.5rem',
                    width: '37rem',
                    borderColor: 'white',
                  }}
                />
              </div>
              {cartItem.data.map((item, index) => (
                <div className={cx('items')} key={index}>
                  <div className={cx('image')}>
                    <Image src={item.image} alt='img-motorbike' preview={false} />
                  </div>
                  <div className={cx('information')}>
                    <h2>{item.name}</h2>
                    <p>{handleModifyPrice(item.price)}</p>
                  </div>
                  <div className={cx('delete')}>
                    <CloseCircleOutlined
                      width={32}
                      onClick={() => {
                        modal.confirm({
                          title: 'Xác nhận',
                          icon: <ExclamationCircleOutlined />,
                          content: 'Bạn có chắc chắn muốn xe này xoá khỏi giỏ hàng ?',
                          okText: 'Xoá',
                          cancelText: 'Huỷ',
                          onOk: () => {
                            dispatch(
                              removeItemOfCartItem({
                                cartItemId: cartItem.id,
                                itemId: item.id,
                              })
                            );
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={cx('total')}>
          <div>Tổng tiền: {handleModifyPrice(totalAmount)}</div>
        </div>
        <div className={cx('payment')}>
          <Radio.Group onChange={onChangePayment} value={payment}>
            <Space direction='vertical'>
              <Radio value={'COD'}>Thanh toán khi nhận xe</Radio>
              <Radio value={'ONL'}>Thanh toán online</Radio>
            </Space>
          </Radio.Group>
        </div>
        <Button onClick={handleRentMotorbike} loading={loading} disabled={!auth}>
          Đăng kí thuê xe
        </Button>
      </div>
    </>
  );
};

export default CartItem;
