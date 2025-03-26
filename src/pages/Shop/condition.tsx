import classNames from 'classnames/bind';
import styles from '@/scss/pages/shop/employeeShop.module.scss';
import { useEffect, useState } from 'react';
import { IMotorbike, fetchMotorbikes } from '@/redux/motorbike/motorbikeSlice';
import { locale } from '@/utils/empty';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Table, TableColumnsType, Tooltip, notification } from 'antd';
import { Motorbike } from '@/type/motorbike';
import useDebounce from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import * as motorbikeServices from '@/services/motorbikeServices';

const cx = classNames.bind(styles);
const { TextArea } = Input;
const ConditionMotorbike = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>('');
  const [motorbike, setMotorbike] = useState<Motorbike>();
  const [searchResult, setSearchResults] = useState<IMotorbike[]>([]);
  const debouncedValue = useDebounce(inputSearch, 500);

  const motorbikes = useAppSelector((state) => state.motorbike.motorbikes);
  const user = useAppSelector((state) => state.auth.auth);
  const dispatch = useAppDispatch();

  const [api, contextHolder] = notification.useNotification();

  // show modal
  const showModal = (item: Motorbike) => {
    setOpen(true);
    setMotorbike(item);
    form.setFieldsValue(item);
  };

  const hideModal = () => {
    setOpen(false);
  };
  // end show
  const columns: TableColumnsType<IMotorbike> = [
    {
      title: 'Tên xe',
      dataIndex: 'motorbike_name',
      key: 'motorbike_name',
      ellipsis: true,
    },
    {
      title: 'Biển số xe',
      dataIndex: 'motorbike_license_plates',
      key: 'motorbike_license_plates',
      ellipsis: true,
    },
    {
      title: 'Tình trạng xe',
      dataIndex: 'condition',
      key: 'condition',
      ellipsis: true,
    },
    {
      title: 'Mô tả xe',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, item) => (
        <Tooltip placement='topRight' title={'Cập nhật'}>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              showModal(item);
            }}
          />
        </Tooltip>
      ),
    },
  ];

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

  useEffect(() => {
    dispatch(fetchMotorbikes(user.shop_id));
  }, [user, dispatch]);

  const handleUpdateCondition = async () => {
    if (motorbike?.motorbike_id) {
      const res = await motorbikeServices.updateConditionMotorbike(
        motorbike?.motorbike_id,
        form.getFieldValue('condition')
      );
      if (res.type === 'success') {
        api['success']({
          message: 'Thành công',
          description: 'Thành công.',
        });
        hideModal();
        dispatch(fetchMotorbikes(user.shop_id));
      } else {
        api['error']({
          message: 'Thất bại',
          description: 'Có lỗi xảy ra.',
        });
      }
    }
  };

  return (
    <>
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
        </div>
        <Table
          columns={columns}
          dataSource={searchResult}
          style={{ marginTop: '8px' }}
          locale={locale}
          rowKey={(record) => record.motorbike_id}
        />
        <Modal
          title='Cập nhật trình trạng xe'
          open={open}
          onOk={form.submit}
          onCancel={hideModal}
          cancelText={'Huỷ'}
          okText={'Ok'}
        >
          <Form initialValues={motorbike} form={form} onFinish={handleUpdateCondition}>
            <Form.Item
              label='Tình trạng xe'
              name={'condition'}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tình trạng xe',
                },
              ]}
            >
              <TextArea />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default ConditionMotorbike;
