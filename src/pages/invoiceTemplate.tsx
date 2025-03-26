import classNames from 'classnames/bind';
import styles from '@/scss/invoice.module.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button, Image, QRCode, Table, TableProps } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import logo from '@/assets/images/logo.jpg';
import { Invoice, Item } from '@/type/invoice';
import { locale } from '@/utils/empty';
import * as employeeServices from '@/services/employeeServices';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

const InvoiceTemplate = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice>();
  const dayDiff = dayjs(invoice?.end_date).diff(dayjs(invoice?.start_date), 'days') + 1;

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const res = await employeeServices.getOrderById(parseInt(id));
        if (res.type === 'success') setInvoice(res.data);
      }
    };

    fetchData();
  }, [id]);

  const formatCurrency = (text: number) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
    return formatter.format(text);
  };

  const columns: TableProps<Item>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
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
      title: 'Thành tiền',
      dataIndex: 'price',
      key: 'price',
      render: (_, { rent_cost }) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
        return formatter.format(rent_cost * dayDiff);
      },
    },
  ];

  const handlePrint = () => {
    window.print();
  };
  return (
    <div className={cx('background')}>
      <div className={cx('wrapper')}>
        <div className={cx('wrapper_header')}>
          <Image src={logo} alt='logo' preview={false} width={100} height={100} />
          <QRCode value={'http://localhost:5173/' || '-'} />
        </div>
        <div className={cx('wrapper_content')}>
          <div className={cx('title')}>
            <h2>RENT MOTORBIKE</h2>
            <h3>HOÁ ĐƠN</h3>
            <p>MÃ ĐƠN THUÊ: {id}</p>
          </div>
          <div className={cx('information')}>
            <div className={cx('information_shop')}>
              <p>Tên cửa hàng: {invoice?.shop.name}</p>
              <p>Địa chỉ: {invoice?.shop.address}</p>
              <p>Số điện thoại: {invoice?.shop.phone_number}</p>
              <p>Email: {invoice?.shop.email}</p>
            </div>
            <div className={cx('information_customer')}>
              <p>Tên khách hàng: {invoice?.customer.name}</p>
              <p>Số điện thoại: {invoice?.customer.phone_number}</p>
              <p>Email: {invoice?.customer.email}</p>
              <p>CCCD: {invoice?.customer.cccd}</p>
            </div>
          </div>
          <div className={cx('date')}>
            <h4>Thông tin thuê xe</h4>
            <p>Ngày bắt đầu: {invoice?.start_date}</p>
            <p>Ngày kết thúc: {invoice?.end_date}</p>
          </div>
          <div className={cx('list_motorbike')}>
            <Table
              columns={columns}
              dataSource={invoice?.items}
              style={{ marginTop: '20px' }}
              locale={locale}
              rowKey={(record) => record.id}
              pagination={false}
            />
          </div>
          <div className={cx('total_price')}>
            <h4>Tổng tiền: {formatCurrency(invoice?.total_price ?? 0)}</h4>
          </div>
        </div>
        <div className={cx('note')}>
          <p>Quý khách vui lòng xuất trình hoá đơn này tại cửa hàng</p>
          <p>
            Quý khách vui lòng mang theo các giấy tờ như căn cước công dân / chứng minh nhân dân,
            bằng lái xe
          </p>
        </div>
      </div>
      <div className={cx('print')}>
        <Button icon={<PrinterOutlined />} onClick={handlePrint} />
      </div>
    </div>
  );
};

export default InvoiceTemplate;
