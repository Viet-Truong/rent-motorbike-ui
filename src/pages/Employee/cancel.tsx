import classNames from 'classnames/bind';
import styles from '@/scss/pages/employee/cancel.module.scss';
import { useEffect, useState } from 'react';
import { Button, Flex, Input, Spin, Table, TableColumnsType, Tooltip } from 'antd';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/redux/hooks';

import { Motorbike } from '@/type/motorbike';
import { rental } from '@/type/rental';
import * as employeeServices from '@/services/employeeServices';
import Approve from '@/components/modal/rental/approve';
import useDebounce from '@/hooks/useDebounce';
import dayjs from 'dayjs';
import { locale } from '@/utils/empty';

const cx = classNames.bind(styles);
const pageSize = 10;
let currentPage = 1;
const Cancel = () => {
  const user = useAppSelector((state) => state.auth.auth);
  const [rentalList, setRentalList] = useState<rental[]>();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [item, setItem] = useState<Motorbike[]>();
  const [inputSearch, setInputSearch] = useState<string>('');
  const debouncedValue = useDebounce(inputSearch, 500);

  useEffect(() => {
    const fetchData = async () => {
      const response = await employeeServices.getAllOrderByShop({
        status: 'Đã huỷ',
        shop_id: user.shop_id,
        q: debouncedValue,
      });
      if (response?.data.type === 'success') {
        setRentalList(response.data.result);
      }
    };

    fetchData();
  }, [user, debouncedValue]);

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
      title: 'Người huỷ',
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
      title: 'Lí do huỷ',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, { details }) => (
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
        </Flex>
      ),
    },
  ];

  if (rentalList === undefined) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin />
      </div>
    );
  }
  return (
    <>
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
        {item && <Approve item={item} isModalOpen={isShowModal} setIsModalOpen={setIsShowModal} />}
      </div>
    </>
  );
};

export default Cancel;
