import { AreaChartOutlined, HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { FC, useEffect } from 'react';
import Template from '../components/template';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/auth/authSlice';
import motorbike from '@/assets/images/motorbike.png';
import employee from '@/assets/images/employee.png';
import config from '@/config';

const ShopLayout: FC<{ children: React.ReactNode | JSX.Element }> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!user) {
      localStorage.setItem('previousPage', window.location.pathname);
      navigate('/login');
    } else if (user.role_id !== 4 || user.shop_id === null) {
      navigate('/');
      alert('Bạn không thể truy cập vào trang shop!');
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
      defaultSelectedKeys={[config.routes.shop]}
      onClick={(e) => handleMenuItemClick(e.key)}
    >
      <Menu.Item key={config.routes.shop} icon={<HomeOutlined twoToneColor='#eb2f96' />}>
        Trang chủ
      </Menu.Item>
      <Menu.Item
        key={config.routes.employeeShop}
        icon={<img src={employee} width={'14px'} height={'14px'} />}
      >
        Quản lí tài khoản nhân viên
      </Menu.Item>
      <Menu.Item
        key={config.routes.motorbikeShop}
        icon={<img src={motorbike} width={'14px'} height={'14px'} />}
      >
        Quản lí xe
      </Menu.Item>
      <Menu.Item
        key={config.routes.condition}
        icon={<img src={motorbike} width={'14px'} height={'14px'} />}
      >
        Tình trạng xe
      </Menu.Item>
      <Menu.Item key={config.routes.profileShop} icon={<UserOutlined />}>
        Cửa hàng
      </Menu.Item>
      <Menu.Item key={config.routes.statistic} icon={<AreaChartOutlined />}>
        Thống kê
      </Menu.Item>
      <Menu.Item key={'/'} icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <div className='shop-layout'>
      <Layout>
        <Template menu={menu}>{children}</Template>
      </Layout>
    </div>
  );
};

export default ShopLayout;
