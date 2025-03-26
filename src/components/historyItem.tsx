import classNames from 'classnames/bind';
import styles from '@/scss/components/historyItem.module.scss';
import { Col, Image, Row } from 'antd';
import { Motorbike } from '@/type/motorbike';
import noImage from '@/assets/images/noImage.jpg';

const cx = classNames.bind(styles);
const HistoryItem = ({ item }: { item: Motorbike }) => {
  const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 };
  const price = new Intl.NumberFormat('vi-VN', config).format(item?.rent_cost ?? 0);
  const violation_price = new Intl.NumberFormat('vi-VN', config).format(
    parseInt(item?.violation_price ?? '') || 0
  );
  return (
    <div className={cx('wrapper')}>
      <Row>
        <Col span={6}>
          <Image
            src={item.images[0] || noImage}
            preview={false}
            width={150}
            className={cx('image')}
          />
        </Col>
        <Col span={18}>
          <h2>{item.motorbike_name}</h2>
          <p>{item.description}</p>
          <p>
            Giá thuê: <span>{price} / 1 ngày</span>
          </p>
          <p>
            Tiền phạt: <span>{violation_price}</span>
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default HistoryItem;
