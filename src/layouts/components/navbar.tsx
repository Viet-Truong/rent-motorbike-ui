import { HomeFilled } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isInline = false }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Menu
        mode={isInline ? 'inline' : 'horizontal'}
        selectedKeys={[window.location.pathname]}
        onClick={({ key }) => {
          navigate(key);
        }}
        items={[
          {
            label: <HomeFilled />,
            key: '/',
          },
          {
            label: 'Cửa hàng',
            key: '/store',
          },
          {
            label: 'Chính sách',
            key: '/policy',
          },
          {
            label: 'Liên hệ',
            key: '/contact',
          },
        ]}
      />
    </div>
  );
};

export default Navbar;
