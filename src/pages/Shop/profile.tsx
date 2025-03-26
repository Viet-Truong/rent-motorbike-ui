import classNames from 'classnames/bind';
import styles from '@/scss/pages/user/profile.module.scss';
import {
  Button,
  Divider,
  Form,
  GetProp,
  Image,
  Input,
  Modal,
  Select,
  Spin,
  Upload,
  UploadFile,
  UploadProps,
  notification,
} from 'antd';
import { useEffect, useState } from 'react';
import { Shop } from '@/type/shop';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import * as employeeService from '@/services/employeeServices';
import * as provinceServices from '@/services/provinceServices';
import * as shopServices from '@/services/shopServices';
import { setAuth } from '@/redux/auth/authSlice';
import { UploadOutlined } from '@ant-design/icons';
import { City, District, Ward } from '@/type/province';
import noImage from '@/assets/images/noImage.jpg';

const cx = classNames.bind(styles);

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ProfileShop = () => {
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.auth.auth);
  const dispatch = useAppDispatch();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [changeAvatar, setChangeAvatar] = useState<boolean>(false);
  const [shop, setShop] = useState<Shop>();
  const [open, setOpen] = useState<boolean>(false);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [api, contextHolder] = notification.useNotification();

  const showModal = () => {
    if (shop) form.setFieldsValue(shop);
    setOpen(true);
  };
  const hideModal = () => {
    form.resetFields();
    setOpen(false);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  useEffect(() => {
    const fetchData = async () => {
      const res = await shopServices.getShopById(user.shop_id);
      if (res.type === 'success') {
        setShop(res.data);
      }
    };

    fetchData();
  }, [user]);

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

    if (shop?.city_id && shop.district_id) {
      getDistricts(shop.city_id);
      getWards(shop.district_id);
      form.setFieldsValue({
        city_id: shop.city_id,
        district_id: shop.district_id,
      });
    }
  }, [shop, form, open]);

  if (shop === undefined) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}
      >
        <Spin />
      </div>
    );
  }

  const handleChangeValueFormData = async (
    fieldName: keyof Shop,
    value: string | number | string[]
  ) => {
    setShop((prevData) => {
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

  const getDistricts = async (key: number) => {
    const res = await provinceServices.getDistricts(key);
    if (res) {
      setDistricts(
        res.map((res: District) => {
          return {
            value: res.id,
            label: res.name,
          };
        })
      );
    }
  };

  const getWards = async (key: number) => {
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

  const handleCityChange = async (key: number) => {
    form.setFieldValue('district_id', '');
    form.setFieldValue('wards_id', '');

    getDistricts(key);
  };

  const handleDistrictChange = async (key: number) => {
    setWards([]);

    getWards(key);
  };

  const handleChangeAvatar = async () => {
    try {
      if (fileList && fileList.length > 0) {
        const uploadImage = async () => {
          const data = new FormData();
          data.append('file', fileList[0].originFileObj as File);
          data.append('upload_preset', 'rent_motorbike');
          data.append('cloud_name', 'dvirf4mrj');
          const response = await fetch('https://api.cloudinary.com/v1_1/dvirf4mrj/image/upload', {
            method: 'POST',
            body: data,
          });
          const result = await response.json();
          return result.secure_url;
        };
        const imageUrl = await uploadImage();
        const res = await employeeService.updateAvatar({
          user_id: user.user_id,
          avatar: imageUrl,
        });
        if (res.type === 'success') {
          api['success']({
            message: 'Thành công',
            description: 'Cập nhật ảnh thành công.',
          });
          dispatch(setAuth(res.data));
          setChangeAvatar(false);
        } else {
          api['error']({
            message: 'Thất bại',
            description: 'Có lỗi xảy ra.',
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onFinish = async () => {
    const res = await shopServices.updateShop({
      ...shop,
      wards_id: form.getFieldValue('wards_id'),
      shop_id: user.shop_id,
    });
    if (res.type === 'success') {
      api['success']({
        message: 'Thành công',
        description: 'Cập nhật thông tin shop thành công.',
      });
      setShop(res.shop);
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
        <Divider orientation='left'>Thông tin cửa hàng</Divider>
        <div className={cx('wrapper_info')}>
          <div className={cx('avatar')}>
            {changeAvatar ? (
              <>
                <Upload
                  listType='picture-card'
                  className={cx('upload_avatar')}
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : <UploadOutlined />}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
              </>
            ) : (
              <Image
                src={user.avatar || noImage}
                alt='avatar'
                className={cx('image')}
                preview={false}
              />
            )}
            {changeAvatar ? (
              <>
                <Button onClick={() => setChangeAvatar(false)}>Huỷ</Button>
                <Button onClick={handleChangeAvatar}>Đổi</Button>
              </>
            ) : (
              <Button onClick={() => setChangeAvatar(true)}>Đổi ảnh đại diện</Button>
            )}
            <h2>{shop.name}</h2>
          </div>
          <div className={cx('information')}>
            <p>
              Địa chỉ: <span>{shop.full_address}</span>
            </p>
            <p>
              Số điện thoại: <span>{shop.phone_number}</span>
            </p>
            <p>
              Email: <span>{shop.email}</span>
            </p>
            <Button className='ant-btn-customize' onClick={showModal}>
              Cập nhật thông tin cừa hàng
            </Button>
          </div>
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
            initialValues={shop}
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
                value={shop.name}
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
                value={shop.phone_number}
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
                value={shop.email}
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
                value={shop.address}
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

export default ProfileShop;
