import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '@/scss/pages/user/history.module.scss';
import { ListShop } from '@/type/shop';
import { locale } from '@/utils/empty';
import { LoginOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
  notification,
} from 'antd';
import * as shopServices from '@/services/shopServices';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useNavigate } from 'react-router-dom';
import config from '@/config';
import { setAuth } from '@/redux/auth/authSlice';

const cx = classNames.bind(styles);
const ListOWnShop = () => {
  const user = useAppSelector((state) => state.auth.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [listShop, setListShop] = useState<ListShop[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const [api, contextHolder] = notification.useNotification();

  const columns: TableColumnsType<ListShop> = [
    {
      title: 'Tên cửa hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'full_address',
      key: 'full_address',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Trạng thái',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { status }) => {
        let color;
        if (status === 'Hoạt động') {
          color = 'green';
        } else {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={status}>
            {status?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, { shop_id, status }) => (
        <Space size='middle'>
          <Tooltip placement='topRight' title={'Đi đến cửa hàng'}>
            <Button
              icon={<LoginOutlined />}
              onClick={() => {
                if (status === 'Chưa duyệt') {
                  api['error']({
                    message: 'Thất bại',
                    description: 'Bạn chưa thể truy cập cửa hàng.',
                  });
                } else {
                  dispatch(setAuth({ ...user, shop_id: shop_id }));
                  navigate(config.routes.shop);
                }
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    try {
      setLoading(true);
      const fetchData = async () => {
        const res = await shopServices.getListOwnShop(user.user_id);
        if (res.type === 'success') setListShop(res.data);
        else {
          api['error']({
            message: 'Thất bại',
            description: 'Có lỗi xảy ra.',
          });
        }
      };

      fetchData();
    } catch (error) {
      api.error({
        message: 'Thất bại',
        description: 'Có lỗi xảy ra.',
      });
    } finally {
      setLoading(false);
    }
  }, [user, api]);

  if (listShop === undefined) {
    <div style={{ width: '100vw', height: '100vh' }}>
      <Spin />
    </div>;
  }
  return (
    <>
      {contextHolder}
      <div className={cx('wrapper')}>
        <Divider orientation='left'>Danh sách cửa hàng của bạn</Divider>
        <Spin spinning={loading} tip='Đang xử lý...'>
          <Table
            columns={columns}
            dataSource={listShop}
            locale={locale}
            rowKey={(record) => record.shop_id}
          />
        </Spin>
      </div>
    </>
  );
};

export default ListOWnShop;
