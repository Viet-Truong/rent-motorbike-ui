import classNames from 'classnames/bind';
import styles from '@/scss/components/template.module.scss';
import Pusher from 'pusher-js';

import { FC, useEffect, useState } from 'react';
import { Avatar, Badge, Button, Image, Layout, Popover } from 'antd';
import {
  AntDesignOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/redux/hooks';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo.jpg';
import NotificationItem from '@/components/notificationItem';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const cx = classNames.bind(styles);
const pusher = new Pusher('be23de0a2a5a74295922', {
  cluster: 'ap1',
});

const { Header, Sider } = Layout;

interface TemplateProps {
  children: React.ReactNode | JSX.Element;
  menu: React.ReactNode;
}
interface INotification {
  rental_id: number;
  time: string;
  shop_id: number;
}
const Template: FC<TemplateProps> = ({ children, menu }) => {
  const auth = useAppSelector((state) => state.auth.auth);
  const [collapse, setCollapse] = useState<boolean>(false);
  const [notification, setNotification] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<INotification[]>([
    { rental_id: 0, time: '', shop_id: 0 },
  ]);

  useEffect(() => {
    const channel = pusher.subscribe('notifications');
    channel.bind(
      'rent-motorbike',
      ({ message, time, shop_id }: { message: number; time: string; shop_id: number }) => {
        const now = dayjs();
        const notificationDayjs = dayjs(time);
        const timeAgoStr = now.to(notificationDayjs);
        setNotifications((prev) => [
          ...prev,
          {
            rental_id: message,
            time: timeAgoStr,
            shop_id: shop_id,
          },
        ]);
        setNotification(
          notifications.some((item) => {
            console.log(auth.shop_id == item.shop_id);
            return auth.shop_id == item.shop_id;
          })
        );
      }
    );
  }, [auth, notifications]);

  return (
    <div className={cx('wrapper')}>
      <Layout>
        <Sider
          className='sider'
          collapsed={collapse}
          collapsible
          trigger={null}
          style={{ height: '100vh' }}
        >
          <div className='logo' style={{ justifyContent: collapse ? 'center' : 'space-between' }}>
            <Link to={'/'}>
              <div style={{ display: collapse ? 'none' : 'block', color: 'white' }}>
                <Image
                  src={logo}
                  alt='logo'
                  preview={false}
                  width={50}
                  height={50}
                  style={{ borderRadius: '50%' }}
                />
              </div>
            </Link>
            <div className='logo_icon'>
              <Button
                type='text'
                icon={collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapse(!collapse)}
                className='toggle'
                style={{ color: 'white' }}
              />
            </div>
          </div>
          {menu}
        </Sider>
        <Layout>
          <Header
            style={{
              padding: '0 40px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end ',
            }}
          >
            <Popover
              content={
                <div>
                  {notifications.map((item) => {
                    if (auth.shop_id == item.shop_id)
                      return (
                        <NotificationItem
                          rental_id={item.rental_id ?? 0}
                          time={item.time ?? dayjs().toString()}
                        />
                      );
                  })}
                </div>
              }
              title='Thông báo'
              trigger='click'
              placement='bottomRight'
            >
              <Badge dot={notification}>
                <BellOutlined
                  style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '8px',
                    backgroundColor: '#e9e9e9',
                    borderRadius: '50px',
                  }}
                  onClick={() => setNotification(false)}
                />
              </Badge>
            </Popover>
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              icon={<AntDesignOutlined />}
              src={auth?.avatar || ''}
              style={{ marginLeft: '24px' }}
            />
          </Header>
          <div className={cx('container')}>{children}</div>
        </Layout>
      </Layout>
    </div>
  );
};

export default Template;
