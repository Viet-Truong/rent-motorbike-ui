import classNames from 'classnames/bind';
import styles from '@/scss/pages/admin/adminHome.module.scss';

import { FC, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import Template from '../components/template';
import {
  AppstoreOutlined,
  CheckOutlined,
  HomeOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/auth/authSlice';

const cx = classNames.bind(styles);
const AdminLayout: FC<{ children: React.ReactNode | JSX.Element }> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      localStorage.setItem('previousPage', window.location.pathname);
      navigate('/login');
    } else if (user.role_id !== 1) {
      navigate('/');
      alert('Tài khoản của bạn không thể truy cập vào trang admin');
    }
  }, [user]);

  const handleMenuItemClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  const menu = (
    <Menu
      theme='dark'
      mode='inline'
      className='menu-bar'
      selectedKeys={[window.location.pathname]}
      defaultSelectedKeys={['/admin']}
      onClick={(e) => handleMenuItemClick(e.key)}
    >
      <Menu.Item key={'/admin'} icon={<HomeOutlined />}>
        Trang chủ
      </Menu.Item>
      <Menu.SubMenu key={'/admin/shop'} icon={<AppstoreOutlined />} title={'Quản lí cửa hàng'}>
        <Menu.Item key={'/admin/shop/approve'} icon={<CheckOutlined />}>
          Duyệt đăng kí chủ cửa hàng
        </Menu.Item>
        <Menu.Item key={'/admin/shop/list'} icon={<OrderedListOutlined />}>
          Danh sách chủ cửa hàng
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key={'/admin/profile'} icon={<UserOutlined />}>
        Cá nhân
      </Menu.Item>
      <Menu.Item key={'/'} icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      {user && user.role_id === 1 ? (
        <div className={cx('wrapper_admin')}>
          <Layout>
            <Template menu={menu}>{children}</Template>
          </Layout>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default AdminLayout;
