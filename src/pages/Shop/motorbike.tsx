import classNames from 'classnames/bind';
import styles from '@/scss/pages/shop/shopHome.module.scss';
import { useEffect, useState } from 'react';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Button, Input, Modal, Table, TableColumnsType, Tag, Tooltip, notification } from 'antd';
import ModalMotorbike from '@/components/modal/motorbike/modalAddMotorbike';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IMotorbike, fetchMotorbikes } from '@/redux/motorbike/motorbikeSlice';
import useDebounce from '@/hooks/useDebounce';
import * as motorbikeServices from '@/services/motorbikeServices';
import { Motorbike } from '@/type/motorbike';
import ModalUpdateMotorbike from '@/components/modal/motorbike/modalUpdateMotorbike';
import { locale } from '@/utils/empty';

const cx = classNames.bind(styles);

const MotorbikeShop = () => {
  const user = useAppSelector((state) => state.auth.auth);
  const motorbikes = useAppSelector((state) => state.motorbike.motorbikes);
  const [open, setOpen] = useState<boolean>(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>('');
  const [motorbike, setMotorbike] = useState<Motorbike>();
  const [searchResult, setSearchResults] = useState<IMotorbike[]>(motorbikes);
  const debouncedValue = useDebounce(inputSearch, 500);
  const dispatch = useAppDispatch();

  const [api, contextHolder] = notification.useNotification();
  const [modal, contextHolderModal] = Modal.useModal();

  // Handle show modal
  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const showModalUpdate = () => {
    setIsOpenModalUpdate(true);
  };

  const hideModalUpdate = () => {
    setIsOpenModalUpdate(false);
  };
  // End

  const handleLockMotorbike = async (motorbike_id: number, status: string) => {
    const res = await motorbikeServices.lockMotorbike(motorbike_id, status);
    if (res.type === 'success') {
      api['success']({
        message: 'Thành công',
        description: 'Thành công.',
      });
      await dispatch(fetchMotorbikes(user.shop_id));
    } else {
      api['error']({
        message: 'Thất bại',
        description: 'Có lỗi xảy ra.',
      });
    }
  };

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResults(motorbikes);
      return;
    }
    // call API
    const fetch = async () => {
      const result = await motorbikeServices.searchAdmin(user.shop_id, debouncedValue);
      setSearchResults(result.data);
    };
    fetch();
  }, [debouncedValue, motorbikes, user]);

  const columns: TableColumnsType<IMotorbike> = [
    {
      title: 'Tên xe',
      dataIndex: 'motorbike_name',
      key: 'motorbike_name',
      ellipsis: true,
    },
    {
      title: 'Hãng xe',
      dataIndex: 'brand',
      key: 'brand',
      ellipsis: true,
    },
    {
      title: 'Biển số xe',
      dataIndex: 'motorbike_license_plates',
      key: 'motorbike_license_plates',
      ellipsis: true,
    },
    {
      title: 'Loại xe',
      dataIndex: 'motorbike_type',
      key: 'motorbike_type',
      ellipsis: true,
    },
    {
      title: 'Giá thuê xe',
      dataIndex: 'rent_cost',
      key: 'rent_cost',
      ellipsis: true,
      render: (text) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
        return formatter.format(text);
      },
    },
    {
      title: 'Mô tả xe',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => (
        <Tag color={status === 'Hoạt động' ? 'green' : 'volcano'} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, item) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip placement='topRight' title={'Sửa'}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                showModalUpdate();
                setMotorbike(item);
              }}
            />
          </Tooltip>
          {item.status === 'Hoạt động' ? (
            <Tooltip placement='topRight' title={'Khoá xe'}>
              <Button
                icon={<LockOutlined />}
                onClick={() => {
                  modal.confirm({
                    title: 'Xác nhận',
                    icon: <ExclamationCircleOutlined />,
                    content: 'Bạn có chắc chắn muốn khoá xe này không ?',
                    okText: 'Có',
                    cancelText: 'Huỷ',
                    onOk: () => {
                      handleLockMotorbike(item.motorbike_id, 'Đã khoá');
                    },
                  });
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip placement='topRight' title={'Mở khoá xe'}>
              <Button
                icon={<UnlockOutlined />}
                onClick={() => {
                  modal.confirm({
                    title: 'Xác nhận',
                    icon: <ExclamationCircleOutlined />,
                    content: 'Bạn có chắc chắn muốn mở khoá xe này không ?',
                    okText: 'Có',
                    cancelText: 'Huỷ',
                    onOk: () => {
                      handleLockMotorbike(item.motorbike_id, 'Hoạt động');
                    },
                  });
                }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchMotorbikes(user.shop_id));
  }, [user, dispatch]);

  return (
    <>
      {contextHolderModal}
      {contextHolder}
      <div className={cx('wrapper')}>
        <div className={cx('search')}>
          <Input
            prefix={<SearchOutlined />}
            placeholder='Tìm kiếm xe'
            allowClear
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            style={{ width: '250px', height: '36px' }}
          />
          <Button icon={<PlusSquareOutlined />} className='ant-btn-customize' onClick={showModal} />
        </div>
        <Table
          columns={columns}
          dataSource={searchResult}
          style={{ marginTop: '8px' }}
          locale={locale}
          rowKey={(record) => record.motorbike_id}
        />
        <ModalMotorbike open={open} hideModal={hideModal} />
        {motorbike && (
          <ModalUpdateMotorbike
            open={isOpenModalUpdate}
            hideModal={hideModalUpdate}
            item={motorbike}
          />
        )}
      </div>
    </>
  );
};

export default MotorbikeShop;
