import classNames from 'classnames/bind';
import styles from '@/scss/pages/employee/approve.module.scss';
import { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  notification,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/redux/hooks';

import { Motorbike } from '@/type/motorbike';
import { rental } from '@/type/rental';
import * as employeeServices from '@/services/employeeServices';
import Approve from '@/components/modal/rental/approve';
import useDebounce from '@/hooks/useDebounce';
import dayjs from 'dayjs';
import { locale } from '@/utils/empty';

const cx = classNames.bind(styles);
const { TextArea } = Input;
const pageSize = 10;
let currentPage = 1;
const ApproveRentMotorbike = () => {
  const user = useAppSelector((state) => state.auth.auth);
  const [form] = Form.useForm();
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [rentalList, setRentalList] = useState<rental[]>();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState<Motorbike[]>();
  const [rentalId, setRentalId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const [inputSearch, setInputSearch] = useState<string>('');
  const debouncedValue = useDebounce(inputSearch, 500);

  const [modal, contextHolderModal] = Modal.useModal();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      if (rentalId) {
        const res = await employeeServices.cancelOrder(
          user.user_id,
          rentalId,
          `Lí do: ${form.getFieldValue('note')}`
        );
        if (res) {
          api['success']({
            message: 'Thành công',
            description: 'Huỷ thuê xe thành công.',
          });
          setIsApprove(true);
          setIsModalOpen(false);
        } else {
          api['error']({
            message: 'Thất bại',
            description: 'Có lỗi xảy ra.',
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await employeeServices.getAllOrderByShop({
        status: 'Chưa lấy xe',
        shop_id: user.shop_id,
        q: debouncedValue,
      });
      if (response?.data.type === 'success') {
        setRentalList(response.data.result);
      }
    };

    fetchData();
  }, [isApprove, user, debouncedValue]);

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
          <Tooltip placement='topRight' title={'Duyệt đăng kí thuê xe'}>
            <Button
              icon={<CheckOutlined />}
              onClick={() => {
                modal.confirm({
                  title: 'Xác nhận',
                  icon: <ExclamationCircleOutlined />,
                  content: 'Bạn có chắc chắn muốn duyệt đăng kí thuê xe này không ?',
                  okText: 'Có',
                  cancelText: 'Huỷ',
                  onOk: () => {
                    handleConfirmOrder(rental_id);
                  },
                });
              }}
            />
          </Tooltip>
          <Tooltip placement='topRight' title={'Huỷ đăng kí'}>
            <Button
              icon={<CloseOutlined />}
              onClick={() => {
                showModal();
                setRentalId(rental_id);
              }}
            />
          </Tooltip>
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

  const handleConfirmOrder = async (rental_id: number) => {
    const response = await employeeServices.acceptRentOrder({
      censor_id: user.user_id,
      rental_id,
    });
    if (response?.data.type === 'success') {
      api['success']({
        message: 'Thành công',
        description: 'Xác nhận thành công.',
      });
      setIsApprove(true);
    } else {
      api['error']({
        message: 'Thất bại',
        description: 'Có lỗi xảy ra.',
      });
    }
  };

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
        {item && <Approve item={item} isModalOpen={isShowModal} setIsModalOpen={setIsShowModal} />}
      </div>
      <Modal
        title='Huỷ'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText='Huỷ'
        okText='Đồng ý'
        confirmLoading={loading}
      >
        <Form
          name='Form'
          initialValues={{
            remember: false,
          }}
          form={form}
        >
          <Form.Item
            name={'note'}
            label='Lí do'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập lí do bạn muốn huỷ.',
              },
            ]}
          >
            <TextArea placeholder='Tôi muốn đổi xe khác, ...' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ApproveRentMotorbike;
