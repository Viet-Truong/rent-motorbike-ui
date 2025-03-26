/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormMotorbikeData } from '@/type/motorbike';
import { formatValue, handleKeyPress, parseValue } from '@/utils/currency';
import { PlusOutlined } from '@ant-design/icons';
import { Col, Form, Image, Input, InputNumber, Row, Select, Upload, UploadFile } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadChangeParam } from 'antd/es/upload';
interface IFormMotorbikeProps {
  handleChangeValueFormData: (
    fieldName: keyof FormMotorbikeData,
    value: string | number | null | string[]
  ) => void;
  motorbikeData: FormMotorbikeData;
  fileList: UploadFile[];
  handleChange: (info: UploadChangeParam<UploadFile>) => void;
  handlePreview: (file: UploadFile) => Promise<void>;
  previewImage: string;
  previewOpen: boolean;
  handleChangeType: (value: string) => void;
  setPreviewOpen: React.Dispatch<React.SetStateAction<boolean> | boolean>;
  setPreviewImage: (value: string) => void;
  form: any;
}

const FormMotorbike = ({
  form,
  motorbikeData,
  handleChangeValueFormData,
  fileList,
  handleChange,
  handlePreview,
  previewImage,
  previewOpen,
  handleChangeType,
  setPreviewOpen,
  setPreviewImage,
}: IFormMotorbikeProps) => {
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <Form
      style={{
        maxHeight: '80vh',
      }}
      initialValues={{
        remember: false,
      }}
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
            <Input
              placeholder='Tên xe'
              size='large'
              value={motorbikeData?.motorbike_name}
              onChange={(e) => handleChangeValueFormData('motorbike_name', e.target.value)}
            />
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
            <Input
              placeholder='Hãng xe'
              size='large'
              value={motorbikeData?.brand}
              onChange={(e) => handleChangeValueFormData('brand', e.target.value)}
            />
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
            <Input
              placeholder='43F1-99999'
              size='large'
              value={motorbikeData?.motorbike_license_plates}
              onChange={(e) =>
                handleChangeValueFormData('motorbike_license_plates', e.target.value)
              }
            />
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
              onChange={handleChangeType}
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
              controls={false}
              formatter={formatValue}
              parser={parseValue}
              onKeyPress={handleKeyPress}
              value={motorbikeData?.rent_cost}
              onChange={(value) => handleChangeValueFormData('rent_cost', value)}
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
            <TextArea
              rows={4}
              placeholder='Mô tả xe'
              value={motorbikeData?.description}
              onChange={(e) => handleChangeValueFormData('description', e.target.value)}
            />
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
          multiple
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
  );
};

export default FormMotorbike;
