import classNames from 'classnames/bind';
import styles from '@/scss/pages/user/history.module.scss';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';

import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Spin,
  Table,
  Tag,
  Tooltip,
  notification,
} from 'antd';
import type { TableProps } from 'antd';
import { rental } from '@/type/rental';
import * as employeeService from '@/services/employeeServices';
import { CloseCircleOutlined, InfoCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import * as employeeServices from '@/services/employeeServices';
import { locale } from '@/utils/empty';

const cx = classNames.bind(styles);
const { TextArea } = Input;
const pageSize = 10;
let currentPage = 1;
const History = () => {
  const user = useAppSelector((state) => state.auth.auth);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState<rental[]>();
  const [rentalId, setRentalId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      if (rentalId) {
        const res = await employeeServices.cancelOrder(
          user.user_id,
          rentalId,
          `Lí do ${form.getFieldValue('note')}`
        );
        if (res) {
          api['success']({
            message: 'Thành công',
            description: 'Huỷ thuê xe thành công.',
          });
          fetchData();
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchData = async () => {
    const res = await employeeService.getAllOrderByUserId(user.user_id);
    if (res.type === 'success') {
      setHistory(res.result);
    } else {
      api['error']({
        message: 'Thất bại',
        description: 'Có lỗi xảy ra.',
      });
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      fetchData();
    } catch (error) {
      api.error({
        message: 'Thất bại',
        description: 'Có lỗi xảy ra.',
      });
    } finally {
      setLoading(false);
    }
  }, [api, user]);

  if (history === undefined) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Spin />
      </div>
    );
  }

  const columns: TableProps<rental>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'rental_id',
      key: 'rental_id',
      render: (text, record, index) => {
        console.log(text, record);
        return (currentPage - 1) * pageSize + index + 1;
      },
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
      title: 'Địa chỉ cửa hàng',
      dataIndex: 'shop',
      key: 'shop',
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
      title: 'Trạng thái',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { status }) => {
        let color;
        if (status === 'Chưa lấy xe') {
          color = 'geekblue';
        } else if (status === 'Đã lấy xe') {
          color = 'green';
        } else {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
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
      render: (_, item) => (
        <Flex>
          <Tooltip placement='topRight' title='In hoá đơn'>
            <Button
              icon={<PrinterOutlined />}
              disabled={item.status === 'Đã huỷ'}
              onClick={() => {
                window.open(`/invoice/${item.rental_id}`, '_blank');
              }}
            />
          </Tooltip>
          <Tooltip placement='topRight' title='Xem chi tiết'>
            <Button
              icon={<InfoCircleOutlined />}
              style={{ marginLeft: '4px' }}
              onClick={() => {
                navigate('/history/detail', {
                  state: { details: item.details, total_price: item.total_price },
                });
              }}
            />
          </Tooltip>
          <Tooltip placement='topRight' title='Huỷ đơn'>
            <Button
              icon={<CloseCircleOutlined />}
              style={{ marginLeft: '4px' }}
              onClick={() => {
                showModal();
                setRentalId(item.rental_id);
              }}
              disabled={
                dayjs(item.start_date).startOf('day').isBefore(dayjs().startOf('day')) ||
                item.status === 'Đã lấy xe' ||
                item.status === 'Hoàn tất' ||
                item.status === 'Đã huỷ'
              }
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className={cx('wrapper')}>
        <Divider orientation='left'>LỊCH SỬ THUÊ XE</Divider>
        <Spin spinning={loading} tip='Đang xử lý...'>
          <Table
            columns={columns}
            dataSource={history}
            style={{ marginTop: '20px' }}
            locale={locale}
            rowKey={(record) => record.rental_id}
            pagination={{
              onChange: (page) => {
                currentPage = page;
              },
            }}
          />
        </Spin>
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

export default History;
