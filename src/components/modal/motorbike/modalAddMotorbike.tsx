import { Form, GetProp, Modal, UploadFile, UploadProps, notification } from 'antd';
import { useEffect, useState } from 'react';
import { FormMotorbikeData } from '@/type/motorbike';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addNewMotorbike, resetCreate } from '@/redux/motorbike/motorbikeSlice';
import FormMotorbike from '../../formMotorbike';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const initialValues = {
  motorbike_name: '',
  brand: '',
  status: 'Hoạt động',
  motorbike_license_plates: '',
  motorbike_type: 'Xe ga',
  rent_cost: 150000,
  slug: '123',
  description: '',
  shop_id: 1,
  images: [],
};

const ModalMotorbike = ({ open, hideModal }: { open: boolean; hideModal: () => void }) => {
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.auth.auth);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [motorbikeData, setMotorbikeData] = useState<FormMotorbikeData>(initialValues);
  const isCreateSuccess = useAppSelector((state) => state.motorbike.isCreateSuccess);
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useAppDispatch();

  // Handle change select
  const handleChangeType = (value: string) => {
    handleChangeValueFormData('motorbike_type', value);
  };

  // Handle review image
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  // end

  // Handle change form data
  const handleChangeValueFormData = async (
    fieldName: keyof FormMotorbikeData,
    value: string | number | null | string[]
  ) => {
    setMotorbikeData((prevData) => {
      if (fieldName === 'images' && Array.isArray(value)) {
        const updateImages = [...prevData.images, ...value];
        return {
          ...prevData,
          [fieldName]: updateImages,
        };
      }
      return {
        ...prevData,
        [fieldName]: value,
      };
    });
  };

  const convertToSlug = (slug: string) => {
    // eslint-disable-next-line no-useless-escape
    slug = slug.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLowerCase();
    slug = slug.replace(/^\s+|\s+$/gm, '');
    slug = slug.replace(/\s+/g, '-');
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    slug = `${slug}-${randomNumber}`;
    return slug;
  };

  const handleFinish = async () => {
    try {
      if (fileList && fileList.length > 0) {
        setLoading(true);
        const uploadPromises = fileList.map((file) => {
          const data = new FormData();
          data.append('file', file.originFileObj as File);
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
        dispatch(
          addNewMotorbike({
            motorbike_name: motorbikeData.motorbike_name,
            brand: motorbikeData.brand,
            status: 'Hoạt động',
            motorbike_license_plates: motorbikeData.motorbike_license_plates,
            motorbike_type: motorbikeData.motorbike_type,
            rent_cost: motorbikeData.rent_cost,
            slug: convertToSlug(motorbikeData.motorbike_name),
            description: motorbikeData.description,
            shop_id: user.shop_id,
            images: uploadedImageUrls,
          })
        );
        form.resetFields();
        setMotorbikeData(initialValues);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCreateSuccess !== null) {
      if (isCreateSuccess === true) {
        setMotorbikeData(initialValues);
        hideModal();
        api['success']({
          message: 'Thành công',
          description: 'Thêm xe thành công.',
        });
        dispatch(resetCreate());
      } else {
        api['error']({
          message: 'Thất bại',
          description: 'Có lỗi xảy ra! Vui lòng thử lại sau ít phút.',
        });
      }
    }
  }, [isCreateSuccess, api, dispatch, hideModal]);

  return (
    <>
      {contextHolder}
      <div>
        <Modal
          maskClosable={false}
          title='Thêm xe'
          open={open}
          onOk={handleFinish}
          onCancel={hideModal}
          okText='Đồng ý'
          cancelText='Huỷ'
          confirmLoading={loading}
        >
          <FormMotorbike
            form={form}
            motorbikeData={motorbikeData}
            handleChangeValueFormData={handleChangeValueFormData}
            fileList={fileList}
            handleChange={handleChange}
            handlePreview={handlePreview}
            previewImage={previewImage}
            previewOpen={previewOpen}
            handleChangeType={handleChangeType}
            setPreviewImage={setPreviewImage}
            setPreviewOpen={setPreviewOpen}
          />
        </Modal>
      </div>
    </>
  );
};

export default ModalMotorbike;
