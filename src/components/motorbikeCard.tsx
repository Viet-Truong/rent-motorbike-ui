import classNames from 'classnames/bind';
import styles from '@/scss/components/motorbikeCard.module.scss';
import { Image, Rate } from 'antd';
import { Link } from 'react-router-dom';
import { Motorbike } from '@/type/motorbike';
import noImage from '@/assets/images/noImage.jpg';

interface IMotorbikeCardProps {
  motorbike?: Motorbike;
  type: string;
}

const cx = classNames.bind(styles);
const MotorbikeCard = ({ type, motorbike }: IMotorbikeCardProps) => {
  const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 };
  const price = new Intl.NumberFormat('vi-VN', config).format(motorbike?.rent_cost ?? 0);
  return (
    <div className={cx(type === 'card' ? 'card' : 'suggest')}>
      <div className={cx('image')}>
        <Image
          src={motorbike?.images[0] || noImage}
          height={'100%'}
          width={'100%'}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={cx('content')}>
        <div className={cx('review_container')}>
          <p>Đánh giá</p>
          <Rate disabled defaultValue={motorbike?.evaluate || 0} />
        </div>
        <Link to={`/motorbike/${motorbike?.slug}`}>
          <h4 className={cx('name')}>{motorbike?.motorbike_name}</h4>
          <h5 className={cx('price')}>{price}</h5>
          {type !== 'suggest' ? (
            <>
              <div className={cx('description')}>
                <p>{motorbike?.description}</p>
              </div>
            </>
          ) : (
            ''
          )}
        </Link>
      </div>
    </div>
  );
};

export default MotorbikeCard;
