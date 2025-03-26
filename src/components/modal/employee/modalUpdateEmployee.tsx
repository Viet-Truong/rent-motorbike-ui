import { resetUpdate, updateEmployees } from '@/redux/employee/employeeSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { User } from '@/type/user';
import {
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Modal,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';

const ModalUpdateEmployee = ({
  item,
  open,
  hideModal,
}: {
  item: User;
  open: boolean;
  hideModal: () => void;
}) => {
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.auth.auth);
  const dispatch = useAppDispatch();
  const isUpdateSuccess = useAppSelector(
    (state) => state.employee.isUpdateSuccess
  );
  const [api, contextHolder] = notification.useNotification();
  const [employeeData, setEmployeeData] = useState(item);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setEmployeeData(item);
  }, [item]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ ...user, dob: dayjs(user.dob) });
    }
  }, [user, form]);

  useEffect(() => {
    if (employeeData) {
      form.setFieldsValue({ ...employeeData, dob: dayjs(employeeData.dob) });
    }
  }, [employeeData, form]);

  const onFinish = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      dispatch(
        updateEmployees({
          ...employeeData,
          shop_id: user.shop_id,
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {};

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date);
    handleChangeValueFormData('dob', dateString);
  };

  const handleChangeValueFormData = async (
    fieldName: keyof User,
    value: string | number | string[]
  ) => {
    setEmployeeData((prevData) => {
      return {
        ...prevData,
        [fieldName]: value,
      };
    });
  };

  useEffect(() => {
    if (isUpdateSuccess === true) {
      hideModal();
      api['success']({
        message: 'Thành công',
        description: 'Sửa thông tin nhân viên thành công.',
      });
      dispatch(resetUpdate());
    }
  }, [isUpdateSuccess]);

  return (
    <>
      {contextHolder}
      <Modal
        maskClosable={false}
        title='Sửa thông tin nhân viên'
        open={open}
        onOk={onFinish}
        onCancel={hideModal}
        okText='Đồng ý'
        cancelText='Huỷ'
        confirmLoading={loading}
      >
        <Form
          name='register'
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
          initialValues={{
            ...employeeData,
            dob: dayjs(employeeData.dob),
          }}
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
              value={employeeData.fullName}
              onChange={(e) =>
                handleChangeValueFormData('fullName', e.target.value)
              }
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
                message: 'Vui lòng chọn ngày sinh.',
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
                      return Promise.reject(
                        new Error('Bạn phải đủ 18 tuổi trở lên.')
                      );
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              onChange={onChange}
              format='YYYY-MM-DD'
              placeholder='Chọn ngày sinh'
              value={dayjs(employeeData.dob)}
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
              value={employeeData.phone_number}
              onChange={(e) =>
                handleChangeValueFormData('phone_number', e.target.value)
              }
            />
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
                message: 'Vui lòng nhập số ccid.',
              },
              {
                len: 12,
                message: 'CCID của bạn không hợp lệ.',
              },
            ]}
          >
            <Input
              placeholder='Căn cước công dân'
              size='large'
              value={employeeData.card_id}
              onChange={(e) =>
                handleChangeValueFormData('card_id', e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name='address'
            hasFeedback
            label='Địa chỉ'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập địa chỉ.',
              },
            ]}
          >
            <Input
              placeholder='Địa chỉ'
              size='large'
              value={employeeData.address}
              onChange={(e) =>
                handleChangeValueFormData('address', e.target.value)
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalUpdateEmployee;
