import classNames from 'classnames/bind';
import styles from '@/scss/pages/shop/employeeShop.module.scss';
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
import { User } from '@/type/user';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import ModalAddEmployee from '@/components/modal/employee/modalAddEmployee';
import { fetchEmployees } from './../../redux/employee/employeeSlice';
import ModalUpdateEmployee from '@/components/modal/employee/modalUpdateEmployee';
import useDebounce from '@/hooks/useDebounce';
import * as employeeServices from '@/services/employeeServices';
import dayjs from 'dayjs';
import { locale } from '@/utils/empty';

const cx = classNames.bind(styles);

const Employees = () => {
  const [isOpenModalAdd, setIsOpenModalAdd] = useState<boolean>(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.auth);
  const [employee, setEmployee] = useState<User>();
  const employees = useAppSelector((state) => state.employee.employees);
  const [inputSearch, setInputSearch] = useState<string>('');
  const [searchResult, setSearchResults] = useState<User[]>(employees);
  const debouncedValue = useDebounce(inputSearch, 500);
  const dispatch = useAppDispatch();

  const [api, contextHolder] = notification.useNotification();
  const [modal, contextHolderModal] = Modal.useModal();

  // Handle show modal
  const showModalAdd = () => {
    setIsOpenModalAdd(true);
  };

  const hideModalAdd = () => {
    setIsOpenModalAdd(false);
  };

  const showModalUpdate = () => {
    setIsOpenModalUpdate(true);
  };

  const hideModalUpdate = () => {
    setIsOpenModalUpdate(false);
  };
  // End

  const handleLockAccount = async (user_id: number, status: string) => {
    const res = await employeeServices.lockAccount(user_id, status);
    if (res.type === 'success') {
      api['success']({
        message: 'Thành công',
        description: 'Thành công.',
      });
      await dispatch(fetchEmployees(user.shop_id));
    } else {
      api['error']({
        message: 'Thất bại',
        description: 'Có lỗi xảy ra.',
      });
    }
  };

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResults(employees);
      return;
    }
    // call API
    const fetch = async () => {
      const result = await employeeServices.search(user.shop_id, debouncedValue);
      setSearchResults(result.data);
    };
    fetch();
  }, [debouncedValue, employees, user]);

  const columns: TableColumnsType<User> = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      key: 'fullName',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      render: (text) => {
        return dayjs(text).format('DD-MM-YYYY');
      },
      ellipsis: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
      ellipsis: true,
    },
    {
      title: 'Căn cước công dân',
      dataIndex: 'card_id',
      key: 'card_id',
      ellipsis: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
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
        <Flex gap={8}>
          <Tooltip placement='topRight' title={'Sửa thông tin'}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                showModalUpdate();
                setEmployee(item);
              }}
            />
          </Tooltip>
          {item.status === 'Hoạt động' ? (
            <Tooltip placement='topRight' title={'Khoá'}>
              <Button
                icon={<LockOutlined />}
                onClick={() => {
                  modal.confirm({
                    title: 'Xác nhận',
                    icon: <ExclamationCircleOutlined />,
                    content: 'Bạn có chắc chắn muốn khoá tài khoản này không ?',
                    okText: 'Có',
                    cancelText: 'Huỷ',
                    onOk: () => {
                      handleLockAccount(item.user_id, 'Đã khoá');
                    },
                  });
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip placement='topRight' title={'Mở khoá'}>
              <Button
                icon={<UnlockOutlined />}
                onClick={() => {
                  modal.confirm({
                    title: 'Xác nhận',
                    icon: <ExclamationCircleOutlined />,
                    content: 'Bạn có chắc chắn muốn mở khoá tài khoản này không ?',
                    okText: 'Có',
                    cancelText: 'Huỷ',
                    onOk: () => {
                      handleLockAccount(item.user_id, 'Hoạt động');
                    },
                  });
                }}
              />
            </Tooltip>
          )}
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    const fetchEmployeesData = async () => {
      await dispatch(fetchEmployees(user.shop_id));
    };

    fetchEmployeesData();
  }, [dispatch, user]);

  if (employees === undefined) {
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
      {contextHolderModal}
      {contextHolder}
      <div className={cx('wrapper')}>
        <div className={cx('search')}>
          <Input
            prefix={<SearchOutlined />}
            placeholder='Tìm kiếm nhân viên'
            allowClear
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            style={{ width: '250px', height: '36px' }}
          />
          <Tooltip placement='left' title={'Thêm nhân viên'}>
            <Button
              icon={<PlusSquareOutlined />}
              className='ant-btn-customize btn_add'
              onClick={showModalAdd}
            />
          </Tooltip>
        </div>
        <Table
          columns={columns}
          dataSource={searchResult}
          style={{ marginTop: '8px' }}
          locale={locale}
          rowKey={(record) => record.user_id}
        />
      </div>
      <ModalAddEmployee open={isOpenModalAdd} hideModal={hideModalAdd} />
      {employee && (
        <ModalUpdateEmployee open={isOpenModalUpdate} hideModal={hideModalUpdate} item={employee} />
      )}
    </>
  );
};

export default Employees;
