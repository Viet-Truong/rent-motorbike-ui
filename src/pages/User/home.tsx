/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames/bind';
import styles from '@/scss/pages/user/home.module.scss';
import { slider_data } from '@/assets/data/slider';
import Slider from '@/components/slider';
import { policy } from '@/assets/data/data';
import MotorbikeCard from '@/components/motorbikeCard';
import { Col, Divider, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import * as motorbikeServices from '@/services/motorbikeServices';
import * as shopServices from '@/services/shopServices';
import { Motorbike } from '@/type/motorbike';
import Map from '@/components/map';
import { Position } from '@/type/shop';

const cx = classNames.bind(styles);
const Home = () => {
  const [motorbikes, setMotorbikes] = useState<Motorbike[]>();
  const [suggest, setSuggest] = useState<Motorbike[]>();
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const fetchMotorbikes = async () => {
      const res = await motorbikeServices.getAllMotorbike();
      if (res.type === 'success') {
        setMotorbikes(res.data);
      }
    };
    fetchMotorbikes();
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await motorbikeServices.getSuggestMotorbike(latitude, longitude);
        if (res.type === 'success') setSuggest(res.data);

        if (latitude && longitude) {
          setPositions((prev) => [
            ...prev,
            {
              lat: latitude,
              lng: longitude,
              name: 'Vị trí hiện tại',
              isCurrent: true,
            },
          ]);
        }
      });
    } else {
      console.log('Geolocation is not available in your browser.');
    }
  }, []);

  useEffect(() => {
    const fetchShopData = async () => {
      const res = await shopServices.getShopWithLocation();
      if (res.type === 'success') {
        res.data.map((item: any) => {
          if (item.latitude && item.longitude) {
            setPositions((prev) => [
              ...prev,
              {
                lat: item.latitude,
                lng: item.longitude,
                name: item.name,
                address: item.full_address,
              },
            ]);
          }
        });
      }
    };
    fetchShopData();
  }, []);

  return (
    <div className={cx('home')}>
      <Slider data={slider_data} timeOut={5000} auto={true} control={true} />
      <div className={cx('wrapper-policy')}>
        {policy.map((item) => (
          <div className={cx('policy__card')} key={item.id}>
            <div className={cx('policy__icon')}>{item.icon}</div>
            <div className={cx('policy__info')}>
              <h4 className={cx('policy__title')}>{item.name}</h4>
              <p className={cx('policy__description')}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={cx('main-content')}>
        <Divider>GỢI Ý CÁC XE THUỘC CÁC CỬA HÀNG GẦN BẠN</Divider>
        <Row gutter={[16, 16]}>
          {suggest !== undefined ? (
            suggest.map((motorbike) => (
              <Col xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
                <MotorbikeCard type='card' key={motorbike.motorbike_id} motorbike={motorbike} />
              </Col>
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
        </Row>
        <Divider>TẤT CẢ XE</Divider>
        <Row gutter={[16, 16]}>
          {motorbikes !== undefined ? (
            motorbikes.map((motorbike) => (
              <Col xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
                <MotorbikeCard type='card' key={motorbike.motorbike_id} motorbike={motorbike} />
              </Col>
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
        </Row>
        <Divider>BẢN ĐỒ DANH SÁCH CỬA HÀNG</Divider>
        <Map positions={positions} />
      </div>
    </div>
  );
};

export default Home;
