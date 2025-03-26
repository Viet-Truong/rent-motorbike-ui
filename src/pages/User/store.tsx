import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '@/scss/pages/user/store.module.scss';

import { Col, Divider, Input, Row, Spin } from 'antd';

import { ListShop } from '@/type/shop';
import * as adminServices from '@/services/adminServices';
import ShopItem from '@/components/shopItem';
import { SearchOutlined } from '@ant-design/icons';
import useDebounce from '@/hooks/useDebounce';

const cx = classNames.bind(styles);
const Store = () => {
  const [shops, setShops] = useState<ListShop[]>([]);
  const [inputSearch, setInputSearch] = useState<string>('');
  const search = useDebounce(inputSearch, 1000);

  useEffect(() => {
    const fetchData = async () => {
      const response = await adminServices.getAllShop(search);
      if (response?.data.type === 'success') {
        setShops(response.data.data);
      }
    };

    fetchData();
  }, [search]);

  if (shops === undefined) {
    <div style={{ width: '100vw', height: '100vh' }}>
      <Spin />
    </div>;
  }

  return (
    <div className={cx('wrapper')}>
      <Divider orientation='left'>Danh sách cửa hàng</Divider>
      <Input
        prefix={<SearchOutlined />}
        placeholder='Tìm kiếm cửa hàng'
        allowClear
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
        style={{ width: '250px', height: '36px', marginBottom: '16px' }}
      />
      <Row gutter={[16, 16]}>
        {shops.map((shop) => (
          <Col xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
            <ShopItem key={shop.shop_id} item={shop} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Store;
