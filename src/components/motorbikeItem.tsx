import { Image } from 'antd';
import noImage from '@/assets/images/noImage.jpg';
import { Link } from 'react-router-dom';

interface IMotorbikeItemProps {
  image: string;
  motorbike_name: string;
  price: number;
  slug: string;
}

const MotorbikeItem = ({ item }: { item: IMotorbikeItemProps }) => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  const price = formatter.format(item.price);
  return (
    <Link to={`/motorbike/${item?.slug}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className='image' style={{ width: '70px' }}>
          <Image
            src={item.image || noImage}
            alt='motorbike_image'
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            preview={false}
          />
        </div>
        <div className='info'>
          <div>{item.motorbike_name}</div>
          <p>{price}</p>
        </div>
      </div>
    </Link>
  );
};

export default MotorbikeItem;
