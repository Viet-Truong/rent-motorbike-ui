import { Menu, Layout } from 'antd';
import { FC, useEffect } from 'react';
import Template from './../components/template';
import {
  HomeOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  CheckOutlined,
  RollbackOutlined,
  UserOutlined,
  StopOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/redux/auth/authSlice';

const EmployeeLayout: FC<{ children: React.ReactNode | JSX.Element }> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!user) {
      localStorage.setItem('previousPage', window.location.pathname);
      navigate('/login');
    } else if (user.role_id !== 3 && user.role_id !== 4) {
      navigate('/');
      alert('Tài khoản của bạn không thể truy cập vào trang nhân viên!');
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
      defaultSelectedKeys={['/shop/employee']}
      onClick={(e) => handleMenuItemClick(e.key)}
    >
      <Menu.Item key={'/shop/employee'} icon={<HomeOutlined />}>
        Trang chủ
      </Menu.Item>
      <Menu.SubMenu key={'Activity'} icon={<AppstoreOutlined />} title={'Quản lí thuê xe'}>
        <Menu.Item key={'/shop/employee/approve'} icon={<CheckOutlined />}>
          Duyệt đăng kí thuê xe
        </Menu.Item>
        <Menu.Item key={'/shop/employee/return'} icon={<RollbackOutlined />}>
          Trả xe
        </Menu.Item>
        <Menu.Item key={'/shop/employee/done'} icon={<OrderedListOutlined />}>
          Danh sách đơn đăng kí đã hoàn tất
        </Menu.Item>
        <Menu.Item key={'/shop/employee/cancel'} icon={<StopOutlined />}>
          Danh sách đơn đăng kí đã huỷ
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key={'/shop/employee/profile'} icon={<UserOutlined />}>
        Cá nhân
      </Menu.Item>
      <Menu.Item key={'/'} icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <div className=''>
      <Layout>
        <Template menu={menu}>{children}</Template>
      </Layout>
    </div>
  );
};

export default EmployeeLayout;
