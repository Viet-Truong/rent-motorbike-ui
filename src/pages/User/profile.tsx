import classNames from 'classnames/bind';
import styles from '@/scss/pages/user/profile.module.scss';
import {
  Button,
  DatePicker,
  Divider,
  Form,
  GetProp,
  Image,
  Input,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
  notification,
} from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { User } from '@/type/user';
import * as employeeService from '@/services/employeeServices';
import { UploadOutlined } from '@ant-design/icons';
import { setAuth } from '@/redux/auth/authSlice';
import noImage from '@/assets/images/noImage.jpg';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Profile = () => {
  const user = useAppSelector((state) => state.auth.auth);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [info, setInfo] = useState<User>(user);
  const [open, setOpen] = useState<boolean>(false);
  const [changeAvatar, setChangeAvatar] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [api, contextHolder] = notification.useNotification();

  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    setInfo(user);
  }, [user]);

  useEffect(() => {
    form.setFieldsValue({ ...user, dob: dayjs(user.dob) });
  }, [user, form]);

  useEffect(() => {
    form.setFieldsValue({ ...info, dob: dayjs(info.dob) });
  }, [info, form]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleChangeValueFormData = async (
    fieldName: keyof User,
    value: string | number | string[]
  ) => {
    setInfo((prevData) => {
      return {
        ...prevData,
        [fieldName]: value,
      };
    });
  };

  const handleChangeAvatar = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    try {
      setLoading(true);
      const res = await employeeService.updateProfile({
        ...info,
        dob: dayjs(form.getFieldValue('dob')).format('YYYY-MM-DD'),
        shop_id: user.shop_id,
      });
      if (res.type === 'success') {
        api['success']({
          message: 'Thành công',
          description: 'Sửa thông tin cá nhân thành công.',
        });
        dispatch(setAuth(res.data));
        hideModal();
      } else {
        api['error']({
          message: 'Thất bại',
          description: res.message,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    api['error']({
      message: 'Thất bại',
      description: 'Có lỗi xảy ra',
    });
  };

  return (
    <>
      {contextHolder}
      <div className={cx('wrapper')}>
        <Divider orientation='left'>Thông tin cá nhân</Divider>
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
                <Button onClick={() => setChangeAvatar(false)} loading={loading}>
                  Huỷ
                </Button>
                <Button onClick={handleChangeAvatar} loading={loading}>
                  Đổi
                </Button>
              </>
            ) : (
              <Button onClick={() => setChangeAvatar(true)}>Đổi ảnh đại diện</Button>
            )}
            <h2>{user.fullName}</h2>
          </div>
          <div className={cx('information')}>
            <p>
              Địa chỉ: <span>{user.address}</span>
            </p>
            <p>
              Số điện thoại: <span>{user.phone_number}</span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
            <p>
              Ngày sinh: <span>{user.dob}</span>
            </p>
            <p>
              Căn cước công dân: <span>{user.card_id}</span>
            </p>
            <Button className='ant-btn-customize' onClick={showModal}>
              Cập nhật thông tin cá nhân
            </Button>
          </div>
        </div>
        <Modal
          title='Cập nhật thông tin cá nhân'
          open={open}
          onOk={form.submit}
          onCancel={hideModal}
          okText='Đồng ý'
          cancelText='Huỷ'
          maskClosable={false}
          confirmLoading={loading}
        >
          <Form
            name='editUser'
            form={form}
            initialValues={user}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
          >
            <Form.Item
              name='fullName'
              hasFeedback
              label='Họ và tên'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên của bạn.',
                },
                {
                  // eslint-disable-next-line no-useless-escape
                  pattern: /^[^\d!@#$%^&*()_+=\[\]{}|\\:;"'<>,.?\/]{3,30}$/,
                  message: 'Vui lòng nhập tên chính xác',
                },
                {
                  type: 'string',
                  message: 'Vui lòng nhập tên chính xác.',
                },
              ]}
            >
              <Input
                placeholder='Họ và tên'
                size='large'
                value={info.fullName}
                onChange={(e) => handleChangeValueFormData('fullName', e.target.value)}
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
                  message: 'Vui lòng nhập địa chỉ email của bạn.',
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
                value={info.email}
                onChange={(e) => handleChangeValueFormData('email', e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name='address'
              hasFeedback
              label='Địa chỉ cụ thể'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ của bạn.',
                },
                {
                  type: 'string',
                  message: 'Địa chỉ không hợp lệ.',
                },
              ]}
            >
              <Input
                placeholder='Số ... đường ..., phường ..., quận ..., thành phố ...'
                size='large'
                value={info.address}
                onChange={(e) => handleChangeValueFormData('address', e.target.value)}
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
                value={info.phone_number}
                onChange={(e) => handleChangeValueFormData('phone_number', e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name='dob'
              hasFeedback
              label='Ngày sinh'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'vui lòng chọn ngày sinh.',
                },
                {
                  type: 'date',
                  message: 'Ngày sinh không hợp lệ.',
                },
                () => ({
                  validator(_, value) {
                    if (value) {
                      const now = moment();
                      const age = moment(now.format('YYYY-MM-DD')).diff(
                        moment(value.format('YYYY-MM-DD')),
                        'years'
                      );
                      if (age < 18) {
                        return Promise.reject(new Error('Bạn phải lớn hơn 18 tuổi.'));
                      }
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker format='DD/MM/YYYY' placeholder='Chọn ngày sinh' />
            </Form.Item>
            <Form.Item
              name='card_id'
              hasFeedback
              label='Căn cước công dân'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền căn cước công dân.',
                },
                {
                  len: 12,
                  message: 'Vui lòng nhập số căn cước hợp lệ',
                },
              ]}
            >
              <Input
                placeholder='Căn cước công dân'
                size='large'
                value={info.card_id}
                onChange={(e) => handleChangeValueFormData('card_id', e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Profile;
