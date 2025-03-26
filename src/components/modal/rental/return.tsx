import { useRef, useState } from 'react';
import { violation } from '@/assets/data/data';
import { Motorbike } from '@/type/motorbike';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tooltip,
  notification,
} from 'antd';
import type { InputRef, SelectProps } from 'antd';
import * as violationServices from '@/services/violationServices';
import { formatValue, handleKeyPress, parseValue } from '@/utils/currency';

interface IReturnProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  item: Motorbike[];
}

const { TextArea } = Input;

const Return = ({ isModalOpen, setIsModalOpen, item }: IReturnProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const [violationItem, setViolationItem] = useState<Motorbike>();
  const inputRef = useRef<InputRef>(null);
  const [formViolation] = Form.useForm();
  const [options, setOptions] = useState<SelectProps['options']>(
    violation.map((item) => ({
      label: item.name,
      value: item.name,
    }))
  );
  const [api, contextHolder] = notification.useNotification();

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns: TableColumnsType<Motorbike> = [
    {
      title: 'Số thứ tự',
      key: 'rental_id',
      render: (value, record, index) => {
        console.log(value, record);
        return index + 1;
      },
    },
    {
      title: 'Tên xe',
      dataIndex: 'motorbike_name',
      key: 'motorbike_name',
    },
    {
      title: 'Hãng xe',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Biển số xe',
      dataIndex: 'motorbike_license_plates',
      key: 'motorbike_license_plates',
    },
    {
      title: 'Giá thuê',
      dataIndex: 'rent_cost',
      key: 'rent_cost',
      render: (text) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
        return formatter.format(text);
      },
    },
    {
      title: 'Lỗi phạt',
      dataIndex: 'violation_type',
      key: 'violation_type',
    },
    {
      title: 'Tiền phạt',
      dataIndex: 'violation_price',
      key: 'violation_price',
      render: (text) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
        return formatter.format(text);
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Space size='middle'>
          <Tooltip placement='topRight' title={'Thêm lỗi'}>
            <Button icon={<PlusOutlined />} onClick={showDrawer} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const handleAddViolation = async (
    violation_id: number,
    violationType: string[],
    note: string,
    price: number,
    motorbike_id: number
  ) => {
    if (violation_id && violationType && note && price && motorbike_id) {
      const response = await violationServices.addViolation({
        violation_id,
        violationType,
        note,
        price,
        motorbike_id,
      });
      if (response?.data.type === 'success') {
        api['success']({
          message: 'Thành công',
          description: 'Thêm lỗi thành công',
        });
        onClose();
        handleCancel();
        formViolation.resetFields();
      } else {
        api['error']({
          message: 'Thất bại',
          description: 'Có lỗi xảy ra',
        });
      }
    } else {
      api['error']({
        message: 'Thất bại',
        description: 'Vui lòng nhập đầy đủ các trường!',
      });
    }
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if (name !== '') {
      setOptions((prev = []) => [
        ...prev,
        {
          label: name,
          value: name,
        },
      ]);
      setName('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <>
      {contextHolder}
      <div>
        <Modal
          title='Chi tiết'
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          maskClosable={false}
          cancelText='Huỷ'
          cancelButtonProps={{ style: { display: 'none' } }}
          okText='Ok'
          width={1000}
        >
          <Table
            columns={columns}
            dataSource={item}
            onRow={(record) => ({
              onClick: () => {
                setViolationItem(record);
              },
            })}
            rowKey={(record) => record.motorbike_id}
          />
        </Modal>
        <Drawer
          title='Lỗi phạt'
          onClose={() => {
            onClose();
            formViolation.resetFields();
          }}
          open={open}
        >
          <p
            style={{
              fontStyle: 'italic',
              color: '#cccccc',
            }}
          >
            *Ghi chú: Nếu bạn đã thêm lỗi rồi và muốn thay đổi hoặc thêm mới vì vui lòng chọn lại từ
            dầu
          </p>
          <Form
            name='Form-violation'
            initialValues={{
              remember: false,
            }}
            form={formViolation}
          >
            <Form.Item
              name={'violation'}
              label='Lỗi phạt'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                mode='multiple'
                allowClear
                style={{ width: '100%' }}
                placeholder='Chọn loại lỗi'
                onChange={handleChange}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <Input
                        placeholder='Nhập lỗi mới'
                        ref={inputRef}
                        value={name}
                        onChange={onNameChange}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      <Button type='text' icon={<PlusOutlined />} onClick={addItem}>
                        Thêm lỗi mới
                      </Button>
                    </Space>
                  </>
                )}
                options={options}
              />
            </Form.Item>
            <Form.Item
              name={'note'}
              label='Ghi chú'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <TextArea placeholder='Hư hại rất nặng về phần ngoại thất, ...' />
            </Form.Item>

            <Form.Item
              name={'total_price'}
              label='Tổng tiền'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <InputNumber
                addonAfter={'VNĐ'}
                defaultValue={0}
                controls={false}
                style={{ width: '100%' }}
                formatter={formatValue}
                parser={parseValue}
                onKeyPress={handleKeyPress}
              />
            </Form.Item>
          </Form>
          <Button
            onClick={() => {
              if (
                violationItem?.violation_id &&
                formViolation.getFieldValue('violation') &&
                formViolation.getFieldValue('note') &&
                formViolation.getFieldValue('total_price') &&
                violationItem?.motorbike_id
              ) {
                handleAddViolation(
                  violationItem?.violation_id,
                  formViolation.getFieldValue('violation'),
                  formViolation.getFieldValue('note'),
                  formViolation.getFieldValue('total_price'),
                  violationItem?.motorbike_id
                );
              } else {
                api['error']({
                  message: 'Thất bại',
                  description: 'Vui lòng nhập đầy đủ các trường!',
                });
              }
            }}
          >
            Thêm lỗi
          </Button>
        </Drawer>
      </div>
    </>
  );
};

export default Return;
