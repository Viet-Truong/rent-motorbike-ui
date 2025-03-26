import classNames from 'classnames/bind';
import styles from '@/scss/components/shopItem.module.scss';

import { Image } from 'antd';
import noImage from '@/assets/images/noImage.jpg';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

interface IShopItemProps {
  shop_id: number;
  image?: string;
  name: string;
  full_address: string;
  phone_number: string;
}
const ShopItem = ({ item }: { item: IShopItemProps }) => {
  return (
    <Link to={`/store/${item.shop_id}`}>
      <div className={cx('wrapper')}>
        <div className={cx('avatar')}>
          <Image
            src={item.image || noImage}
            preview={false}
            width={100}
            height={100}
            style={{ borderRadius: '50%' }}
          />
        </div>
        <div className={cx('info')}>
          <p className={cx('name')}>{item.name}</p>
          <p className={cx('address')}>Địa chỉ: {item.full_address}</p>
          <p className={cx('phone_number')}>Số điện thoại: {item.phone_number}</p>
        </div>
      </div>
    </Link>
  );
};

export default ShopItem;
