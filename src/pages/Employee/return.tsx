import classNames from 'classnames/bind';
import styles from '@/scss/pages/employee/return.module.scss';
import { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Input,
  Modal,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
  notification,
} from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/redux/hooks';

import { rental } from '@/type/rental';
import { Motorbike } from '@/type/motorbike';
import * as employeeServices from '@/services/employeeServices';
import Return from '@/components/modal/rental/return';
import useDebounce from '@/hooks/useDebounce';
import dayjs from 'dayjs';
import { locale } from '@/utils/empty';

const cx = classNames.bind(styles);
const pageSize = 10;
let currentPage = 1;
const ReturnRentMotorbike = () => {
  const user = useAppSelector((state) => state.auth.auth);
  const [rentalList, setRentalList] = useState<rental[]>();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isCheckout, setIsCheckout] = useState<boolean>(false);
  const [item, setItem] = useState<Motorbike[]>();
  const [modal, contextHolderModal] = Modal.useModal();
  const [api, contextHolder] = notification.useNotification();
  const [inputSearch, setInputSearch] = useState<string>('');
  const debouncedValue = useDebounce(inputSearch, 500);

  console.log(debouncedValue);

  useEffect(() => {
    const fetchData = async () => {
      const response = await employeeServices.getAllOrderByShop({
        status: 'Đã lấy xe',
        shop_id: user.shop_id,
        q: debouncedValue,
      });
      if (response?.data.type === 'success') {
        setRentalList(response.data.result);
      }
    };

    fetchData();
  }, [user, isCheckout, debouncedValue, isShowModal]);

  const handleCheckoutOrder = async (rental_id: number) => {
    const response = await employeeServices.checkoutOrder(rental_id, user.user_id);
    if (response?.data.type === 'success') {
      api['success']({
        message: 'Thành công',
        description: 'Xác nhận thành công.',
      });
      setIsCheckout(true);
    } else {
      api['error']({
        message: 'Thất bại',
        description: 'Có lỗi xảy ra.',
      });
    }
  };

  const columns: TableColumnsType<rental> = [
    {
      title: 'Số thứ tự',
      dataIndex: 'rental_id',
      key: 'rental_id',
      render: (text, record, index) => {
        console.log(text, record);
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text) => {
        return dayjs(text).format('DD-MM-YYYY');
      },
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text) => {
        return dayjs(text).format('DD-MM-YYYY');
      },
    },
    {
      title: 'Nhân viên kiểm duyệt',
      dataIndex: 'censor_id',
      key: 'censor_id',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (text) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
        return formatter.format(text);
      },
    },
    {
      title: 'Trạng thái thanh toán',
      key: 'payment_status',
      dataIndex: 'payment_status',
      render: (_, { payment_status }) => {
        let color;
        if (payment_status === 'Chưa thanh toán') {
          color = 'geekblue';
        } else {
          color = 'green';
        }
        return (
          <Tag color={color} key={payment_status}>
            {payment_status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, { rental_id, details }) => (
        <Flex gap={8}>
          <Tooltip placement='topRight' title={'Xem chi tiết'}>
            <Button
              icon={<InfoCircleOutlined />}
              onClick={() => {
                setIsShowModal(true);
                setItem(details);
              }}
            />
          </Tooltip>
          <Tooltip placement='topRight' title={'Xác nhận trả xe'}>
            <Button
              icon={<CheckCircleOutlined />}
              onClick={() => {
                modal.confirm({
                  title: 'Xác nhận',
                  icon: <ExclamationCircleOutlined />,
                  content:
                    'Bạn có chắc chắn muốn xác nhận đã trả tất cả các xe của đăng kí thuê xe này không ?',
                  okText: 'Có',
                  cancelText: 'Huỷ',
                  onOk: () => {
                    handleCheckoutOrder(rental_id);
                  },
                });
              }}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  if (rentalList === undefined) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Spin />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      {contextHolderModal}
      <div className={cx('wrapper')}>
        <div className={cx('search')}>
          <Input
            prefix={<SearchOutlined />}
            placeholder='Tìm kiếm thông tin khách hàng'
            allowClear
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            style={{ width: '250px' }}
          />
        </div>
        <div className={cx('content')}>
          <Table
            columns={columns}
            dataSource={rentalList}
            style={{ marginTop: '8px' }}
            locale={locale}
            rowKey={(record) => record.rental_id}
            pagination={{
              onChange: (page) => {
                currentPage = page;
              },
            }}
          />
        </div>
        {item && <Return item={item} isModalOpen={isShowModal} setIsModalOpen={setIsShowModal} />}
      </div>
    </>
  );
};

export default ReturnRentMotorbike;
