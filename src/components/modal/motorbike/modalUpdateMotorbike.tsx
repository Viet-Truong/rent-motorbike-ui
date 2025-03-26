/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  Col,
  Form,
  GetProp,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  UploadFile,
  UploadProps,
  notification,
} from 'antd';
import { RcFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Motorbike } from '@/type/motorbike';
import { resetUpdate, updateMotorbike } from '@/redux/motorbike/motorbikeSlice';
import { formatValue, handleKeyPress, parseValue } from '@/utils/currency';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const { TextArea } = Input;

const ModalUpdateMotorbike = ({
  open,
  hideModal,
  item,
}: {
  open: boolean;
  hideModal: () => void;
  item: Motorbike;
}) => {
  const user = useAppSelector((state) => state.auth.auth);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const isUpdateSuccess = useAppSelector((state) => state.motorbike.isUpdateSuccess);
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useAppDispatch();

  // Handle review image
  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile<any>[] }) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile<any>) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  // end

  const convertToSlug = (slug: string) => {
    // eslint-disable-next-line no-useless-escape
    slug = slug.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLowerCase();
    slug = slug.replace(/^\s+|\s+$/gm, '');
    slug = slug.replace(/\s+/g, '-');
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    slug = `${slug}-${randomNumber}`;
    return slug;
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleFinish = async () => {
    try {
      if (fileList && fileList.length > 0) {
        setLoading(true);
        const existingUrls = fileList
          .filter((file) => (file as any).url !== undefined)
          .map((file) => (file as any).url);

        const newFiles = fileList
          .filter((file) => (file as any).originFileObj !== undefined)
          .map((file) => (file as any).originFileObj as File);

        const uploadPromises = newFiles.map((file) => {
          const data = new FormData();
          data.append('file', file);
          data.append('upload_preset', 'rent_motorbike');
          data.append('cloud_name', 'dvirf4mrj');
          return fetch('https://api.cloudinary.com/v1_1/dvirf4mrj/image/upload', {
            method: 'POST',
            body: data,
          })
            .then((res) => res.json())
            .then((data) => data.secure_url);
        });

        const uploadedImageUrls = await Promise.all(uploadPromises);
        const allImageUrls = [...existingUrls, ...uploadedImageUrls];

        const values = form.getFieldsValue();
        const motorbikeData = {
          ...values,
          motorbike_id: item.motorbike_id,
          slug: convertToSlug(form.getFieldValue('motorbike_name')),
          images: allImageUrls,
          shop_id: user.shop_id,
        };
        dispatch(updateMotorbike(motorbikeData));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (item) {
      form.setFieldsValue(item);
      const initialFileList: UploadFile<any>[] = item.images.map((url, index) => ({
        uid: String(index),
        name: `image${index + 1}`,
        status: 'done',
        url,
      }));
      setFileList(initialFileList);
    }
  }, [item, form]);

  useEffect(() => {
    if (isUpdateSuccess !== null) {
      if (isUpdateSuccess === true) {
        hideModal();
        api['success']({
          message: 'Thành công',
          description: 'Sửa thông tin xe thành công.',
        });
        dispatch(resetUpdate());
      } else {
        api['error']({
          message: 'Thất bại',
          description: 'Có lỗi xảy ra! Vui lòng thử lại sau ít phút.',
        });
      }
    }
  }, [isUpdateSuccess, api, dispatch, hideModal]);

  return (
    <>
      {contextHolder}
      <div>
        <Modal
          maskClosable={false}
          title='Sửa thông tin xe'
          open={open}
          onOk={handleFinish}
          onCancel={hideModal}
          okText='Đồng ý'
          cancelText='Huỷ'
          confirmLoading={loading}
        >
          <Form
            style={{
              maxHeight: '80vh',
            }}
            initialValues={item}
            form={form}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item
                  name={'motorbike_name'}
                  label='Tên xe'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên xe',
                    },
                  ]}
                >
                  <Input placeholder='Tên xe' size='large' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'brand'}
                  label='Hãng xe'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập hãng xe',
                    },
                  ]}
                >
                  <Input placeholder='Hãng xe' size='large' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'motorbike_license_plates'}
                  label='Biển số xe'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập biển số xe',
                    },
                    {
                      max: 10,
                      message: 'Biển số xe không hợp lệ.',
                    },
                  ]}
                >
                  <Input placeholder='43F1-99999' size='large' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name={'motorbike_type'}
                  label='Loại xe'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn loại xe xe',
                    },
                  ]}
                >
                  <Select
                    defaultValue='Xe ga'
                    options={[
                      { value: 'Xe ga', label: 'Xe ga' },
                      { value: 'Xe số', label: 'Xe số' },
                      { value: 'Xe côn tay', label: 'Xe côn tay' },
                      { value: 'Xe điện', label: 'Xe điện' },
                      { value: 'Khác', label: 'Khác' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={'rent_cost'}
                  label='Giá thuê xe'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập giá thuê xe',
                    },
                  ]}
                >
                  <InputNumber
                    addonAfter={'VNĐ'}
                    defaultValue={100000}
                    formatter={formatValue}
                    parser={parseValue}
                    onKeyPress={handleKeyPress}
                    controls={false}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name={'description'}
                  label='Mô tả xe'
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mô tả của xe',
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder='Mô tả xe' />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name={'images'}
              label='Ảnh xe'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng tải lên ảnh của xe',
                },
              ]}
            >
              <Upload
                listType='picture-card'
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
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
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default ModalUpdateMotorbike;
