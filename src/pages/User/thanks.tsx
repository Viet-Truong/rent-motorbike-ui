import classNames from 'classnames/bind';
import styles from '@/scss/pages/user/thanks.module.scss';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
import * as paymentServices from '@/services/paymentServices';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

const Thanks = () => {
  const [searchParam] = useSearchParams();
  const amount = searchParam.get('vnp_Amount');
  const order_id = searchParam.get('vnp_TxnRef');
  const invoice_id = searchParam.get('vnp_OrderInfo');

  const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 };
  const price = new Intl.NumberFormat('vi-VN', config).format(parseInt(amount || '') / 100);

  function extractNumbers(input: string): number[] {
    const numberPattern = /\d+/g;
    const matches = input.match(numberPattern);
    if (matches) {
      return matches.map(Number);
    }
    return [];
  }

  useEffect(() => {
    const confirmPayment = async () => {
      if (invoice_id) {
        const ids = extractNumbers(invoice_id);

        if (ids) {
          try {
            await Promise.all(
              ids.map(async (id) => {
                await paymentServices.confirmPayment({
                  invoice_id: id,
                  payment_type: 'ONL',
                  pay_date: dayjs().format('YYYY-MM-DD'),
                  status: 'Đã thanh toán',
                });
              })
            );
          } catch (error) {
            console.error('Payment confirmation failed:', error);
          }
        } else {
          console.warn('Invalid invoice_id format:', invoice_id);
        }
      }
    };

    confirmPayment();
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('bg')}>
        <div className={cx('card')}>
          <span className={cx('card__success')}>
            <CheckOutlined style={{ color: 'white', fontSize: '18px' }} />
          </span>
          <h1 className={cx('card__msg')}>THANH TOÁN THÀNH CÔNG</h1>
          <h2 className={cx('card__submsg')}>Cảm ơn bạn đã sử dụng dịch vụ</h2>
          <div className={cx('card__body')}>
            <h1 className={cx('card__price')}>
              <span>{price}</span>
            </h1>
          </div>
          <div className={cx('card__tags')}>
            <span className={cx('card__tag')}>Mã đơn hàng</span>
            <span className={cx('card__tag')}>#{order_id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thanks;
