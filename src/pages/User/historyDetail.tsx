import classNames from 'classnames/bind';
import styles from '@/scss/pages/user/historyDetail.module.scss';
import { Divider } from 'antd';
import HistoryItem from '@/components/historyItem';
import { useLocation } from 'react-router-dom';
import { Motorbike } from '@/type/motorbike';

const cx = classNames.bind(styles);

const HistoryDetail = () => {
  const location = useLocation();
  const { details, total_price } = location.state || {};
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  const price = formatter.format(total_price);
  return (
    <div className={cx('wrapper')}>
      <Divider orientation='left'>LỊCH SỬ THUÊ XE</Divider>
      <div className={cx('history_items')}>
        <div className={cx('history_item')}>
          <div className={cx('header_item')}>
            <h2>Danh sách xe</h2>
          </div>
          <div className={cx('items')}>
            {details.map((item: Motorbike) => (
              <HistoryItem item={item} key={item.motorbike_id} />
            ))}
          </div>
          <div className={cx('total_amount')}>
            <h4>
              Tổng tiền: <span>{price}</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;
