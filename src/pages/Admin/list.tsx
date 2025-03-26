import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '@/scss/pages/admin/list.module.scss';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
  notification,
} from 'antd';

import { EditOutlined, LockOutlined, SearchOutlined, UnlockOutlined } from '@ant-design/icons';
import * as adminServices from '@/services/adminServices';
import { Shop } from '@/type/shop';
import { locale } from '@/utils/empty';
import { City, District, Ward } from '@/type/province';
import * as provinceServices from '@/services/provinceServices';
import * as shopServices from '@/services/shopServices';
import useDebounce from '@/hooks/useDebounce';

const cx = classNames.bind(styles);

const ListShop = () => {
  const [form] = Form.useForm();
  const [shop, setShop] = useState<Shop[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [shopItem, setShopItem] = useState<Shop>();
  const [inputSearch, setInputSearch] = useState<string>('');
  const search = useDebounce(inputSearch, 1000);

  const [api, contextHolder] = notification.useNotification();

  const showModal = (item: Shop) => {
    setShopItem(item);
    setOpen(true);
    form.setFieldsValue(item);
  };
  const hideModal = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    const response = await adminServices.getAllShop(search);
    if (response?.data.type === 'success') {
      setShop(response.data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  useEffect(() => {
    const fetchCities = async () => {
      const res = await provinceServices.getCities();
      if (res) {
        setCities(
          res.map((res: City) => {
            return {
              value: res.id,
              label: res.name,
            };
          })
        );
      }
    };

    fetchCities();

    if (shopItem?.city_id && shopItem.district_id) {
      handleCityChange(shopItem?.city_id);
      handleDistrictChange(shopItem.district_id);
    }
  }, [shopItem]);

  const handleChangeValueFormData = async (
    fieldName: keyof Shop,
    value: string | number | string[]
  ) => {
    setShopItem((prevData) => {
      if (!prevData) {
        return {
          [fieldName]: value,
        } as Shop;
      }
      return {
        ...prevData,
        [fieldName]: value,
      };
    });
  };

  const handleCityChange = async (key: number) => {
    setDistricts([]);
    setWards([]);

    const res = await provinceServices.getDistricts(key);
    if (res)
      setDistricts(
        res.map((res: Ward) => {
          return {
            value: res.id,
            label: res.name,
          };
        })
      );
  };

  const handleDistrictChange = async (key: number) => {
    setWards([]);
    const res = await provinceServices.getWards(key);
    if (res)
      setWards(
        res.map((res: Ward) => {
          return {
            value: res.id,
            label: res.name,
          };
        })
      );
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
      render: (_, item) => (
        <Space size='middle'>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              showModal(item);
            }}
          />
          {item.status === 'Hoạt động' ? (
            <Tooltip placement='topRight' title={'Khoá cửa hàng'}>
              <Button icon={<LockOutlined />} />
            </Tooltip>
          ) : (
            <Tooltip placement='topRight' title={'Mở khoá cửa hàng'}>
              <Button icon={<UnlockOutlined />} />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const onFinish = async () => {
    const res = await shopServices.updateShop({
      ...form.getFieldsValue(),
      shop_id: shopItem?.shop_id,
    });
    if (res.type === 'success') {
      api['success']({
        message: 'Thành công',
        description: 'Cập nhật thông tin shop thành công.',
      });
      fetchData();
      hideModal();
    } else {
      api['error']({
        message: 'Thất bại',
        description: res.message,
      });
    }
  };

  const onFinishFailed = () => {
    api['error']({
      message: 'Thất bại',
      description: 'Có lỗi xảy ra, vui lòng thử lại sau.',
    });
  };

  return (
    <>
      {contextHolder}
      <div className={cx('wrapper')}>
        <Input
          prefix={<SearchOutlined />}
          placeholder='Tìm kiếm cửa hàng'
          allowClear
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          style={{ width: '250px', height: '36px', margin: '10px' }}
        />
        <div className={cx('content')}>
          <Table
            columns={columns}
            dataSource={shop}
            style={{ marginTop: '8px' }}
            locale={locale}
            rowKey={(record) => record.phone_number}
          />
        </div>
        <Modal
          title='Cập nhật thông tin cửa hàng'
          open={open}
          onOk={form.submit}
          onCancel={hideModal}
          okText='Đồng ý'
          cancelText='Huỷ'
          maskClosable={false}
        >
          <Form
            name='editShop'
            form={form}
            initialValues={shopItem}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
          >
            <Form.Item
              name='name'
              hasFeedback
              label='Tên cửa hàng'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên cửa hàng.',
                },
                {
                  type: 'string',
                  message: 'Tên cửa hàng không hợp lệ.',
                },
              ]}
            >
              <Input
                placeholder='Tên cửa hàng'
                size='large'
                value={shopItem?.name}
                onChange={(e) => handleChangeValueFormData('name', e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name='phone_number'
              hasFeedback
              label='Số điện thoại'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại.',
                },
                {
                  pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                  message: 'Số điện thoại không hợp lệ.',
                },
              ]}
            >
              <Input
                placeholder='Số điện thoại'
                size='large'
                value={shopItem?.phone_number}
                onChange={(e) => handleChangeValueFormData('phone_number', e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name='email'
              hasFeedback
              label='Email'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ email.',
                },
                {
                  type: 'email',
                  message: 'Địa chỉ email không hợp lệ.',
                },
              ]}
            >
              <Input
                placeholder='Email'
                size='large'
                value={shopItem?.email}
                onChange={(e) => handleChangeValueFormData('email', e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name='address'
              label='Địa chỉ cụ thể'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ của cửa hàng',
                },
              ]}
            >
              <Input
                placeholder='Số, đường'
                size='large'
                width={100}
                value={shopItem?.address}
                onChange={(e) => handleChangeValueFormData('address', e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name='city_id'
              label='Thành phố'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn thành phố',
                },
              ]}
            >
              <Select
                placeholder='Chọn thành phố'
                style={{ width: '100%', height: '40px' }}
                onChange={(value) => handleCityChange(value)}
                options={cities ?? []}
              />
            </Form.Item>
            <Form.Item
              name='district_id'
              label='Quận'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn quận',
                },
              ]}
            >
              <Select
                placeholder='Chọn quận'
                style={{ width: '100%', height: '40px' }}
                onChange={(value) => handleDistrictChange(value)}
                options={districts ?? []}
              />
            </Form.Item>
            <Form.Item
              name='wards_id'
              label='Chọn phường'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn phường',
                },
              ]}
            >
              <Select
                placeholder='Chọn phường'
                style={{ width: '100%', height: '40px' }}
                options={wards ?? []}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default ListShop;
