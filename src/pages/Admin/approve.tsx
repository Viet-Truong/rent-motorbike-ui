import classNames from 'classnames/bind';
import styles from '@/scss/pages/admin/approve.module.scss';
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  Table,
  TableColumnsType,
  notification,
} from 'antd';
import { Shop } from '@/type/shop';
import { useCallback, useEffect, useState } from 'react';
import * as adminServices from '@/services/adminServices';
import { locale } from '@/utils/empty';

const cx = classNames.bind(styles);
const { TextArea } = Input;

const ApproveShop = () => {
  const [form] = Form.useForm();
  const [shop, setShop] = useState<Shop[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const [modal, contextHolderModal] = Modal.useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shopId, setShopId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminServices.getAllShopApprove();
      if (response?.data.type === 'success') {
        setShop(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (shop_id: number) => {
    try {
      setLoading(true);
      const response = await adminServices.approveShop({ shop_id });
      if (response.type === 'success') {
        api['success']({
          message: 'Thành công',
          description: 'Xác nhận thành công.',
        });
        fetchData();
      } else {
        api['error']({
          message: 'Thất bại',
          description: 'Có lỗi xảy ra.',
        });
      }
    } catch (error) {
      api.error({
        message: 'Thất bại',
        description: 'Có lỗi xảy ra.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegister = async (shop_id: number, note: string) => {
    try {
      setLoading(true);
      const response = await adminServices.cancelShop({ shop_id, note });
      if (response.type === 'success') {
        api['success']({
          message: 'Thành công',
          description: 'Xác nhận thành công.',
        });
        fetchData();
        hideModal();
      } else {
        api['error']({
          message: 'Thất bại',
          description: 'Có lỗi xảy ra.',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumnsType<Shop> = [
    {
      title: 'Tên cửa hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chủ cửa hàng',
      dataIndex: 'owner_name',
      key: 'owner_name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'full_address',
      key: 'full_address',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, { shop_id }) => (
        <Space size='middle'>
          <Button
            icon={<CheckOutlined />}
            onClick={() => {
              modal.confirm({
                title: 'Xác nhận',
                icon: <ExclamationCircleOutlined />,
                content: 'Bạn có chắc chắc muốn duyệt không ?',
                okText: 'Duyệt',
                cancelText: 'Huỷ',
                onOk: () => {
                  if (shop_id) handleApprove(shop_id);
                },
              });
            }}
          />
          <Button
            icon={<CloseOutlined />}
            onClick={() => {
              showModal();
              setShopId(shop_id);
            }}
          />
        </Space>
      ),
    },
  ];
  return (
    <>
      {contextHolder}
      {contextHolderModal}
      <Spin spinning={loading} tip='Đang xử lý...'>
        <div className={cx('wrapper')}>
          <div className={cx('content')}>
            <Table
              columns={columns}
              dataSource={shop}
              style={{ marginTop: '8px' }}
              locale={locale}
              rowKey={(record) => record.phone_number}
            />
          </div>
        </div>
      </Spin>
      <Modal
        title='Huỷ'
        open={isModalOpen}
        onOk={() => shopId && handleCancelRegister(shopId, `Lí do: ${form.getFieldValue('note')}`)}
        onCancel={hideModal}
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

export default ApproveShop;
