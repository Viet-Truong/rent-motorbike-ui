import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { Col, Divider, Row } from 'antd';

import MotorbikeCard from '@/components/motorbikeCard';
import { fetchMotorbikes } from '@/redux/motorbike/motorbikeSlice';
import { useParams } from 'react-router-dom';

const ShopDetail = () => {
  const dispatch = useAppDispatch();
  const motorbikes = useAppSelector((state) => state.motorbike.motorbikes);
  const { id } = useParams();

  useEffect(() => {
    if (id) dispatch(fetchMotorbikes(+id));
  }, [id, dispatch]);
  return (
    <div>
      <Divider>DANH SÁCH TẤT CẢ CÁC XE</Divider>
      <Row gutter={[16, 16]}>
        {motorbikes.map((motorbike) =>
          motorbikes.length > 1 ? (
            <Col xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
              <MotorbikeCard type='card' key={motorbike.motorbike_id} motorbike={motorbike} />
            </Col>
          ) : (
            <MotorbikeCard type='card' key={motorbike.motorbike_id} motorbike={motorbike} />
          )
        )}
      </Row>
    </div>
  );
};

export default ShopDetail;
