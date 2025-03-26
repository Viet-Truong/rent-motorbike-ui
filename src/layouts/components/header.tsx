import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import useDevice from '@/hooks/useDevice';

import Navbar from './navbar';
import CartItem from '@/components/cartItem';
import config from '@/config';

import {
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Drawer,
  Input,
  Popover,
  Tooltip,
  Typography,
} from 'antd';
import {
  AntDesignOutlined,
  FormOutlined,
  HistoryOutlined,
  LogoutOutlined,
  MenuOutlined,
  RobotOutlined,
  SearchOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { logout } from '@/redux/auth/authSlice';
import useDebounce from '@/hooks/useDebounce';
import MotorbikeItem from '@/components/motorbikeItem';
import { Motorbike } from '@/type/motorbike';
import * as motorbikeServices from '@/services/motorbikeServices';
import employee1 from '@/assets/images/employee1.png';

const Header = () => {
  const auth = useAppSelector((state) => state.auth.auth);
  const cart = useAppSelector((state) => state.cart.cartItems);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [isOpenCart, setIsOpenCart] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>('');
  const [searchResult, setSearchResults] = useState<Motorbike[]>([]);
  const debouncedValue = useDebounce(inputSearch, 500);
  const navigate = useNavigate();
  const deviceType = useDevice();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResults([]);
      return;
    }
    // call API
    const fetch = async () => {
      const result = await motorbikeServices.search(debouncedValue);
      setSearchResults(result.data);
    };
    fetch();
  }, [debouncedValue]);

  const options = searchResult.map((item) => ({
    label: (
      <MotorbikeItem
        item={{
          motorbike_name: item.motorbike_name,
          price: item.rent_cost,
          image: item.images[0],
          slug: item.slug,
        }}
      />
    ),
  }));

  return (
    <div className='wrapper_header'>
      <div className='header'>
        {deviceType === 'phone' ? (
          <div className='menuIcon'>
            <MenuOutlined
              style={{
                fontSize: '18px',
                paddingLeft: '12px',
                paddingTop: '6px',
              }}
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            />
          </div>
        ) : (
          <div className='headerMenu'>
            <Navbar />
          </div>
        )}
        <Drawer
          open={isOpenMenu}
          onClose={() => setIsOpenMenu(false)}
          closable={false}
          placement='left'
        >
          <Navbar isInline={deviceType === 'phone' ? true : false} />
        </Drawer>
        <div>
          <Typography.Title level={4}>RENT MOTORBIKE</Typography.Title>
        </div>
        <AutoComplete
          popupClassName='certain-category-search-dropdown'
          popupMatchSelectWidth={300}
          style={{ width: 250 }}
          options={options}
          size='large'
        >
          <Input
            prefix={<SearchOutlined />}
            placeholder='Tìm kiếm xe'
            allowClear
            style={{ width: '200px', height: '36px' }}
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
          />
        </AutoComplete>

        <div className='button'>
          <Tooltip placement='bottom' title={'Giỏ hàng'}>
            <Badge count={cart.length} offset={[-5, 20]}>
              <ShoppingCartOutlined
                onClick={() => setIsOpenCart(!isOpenCart)}
                style={{ width: '28px', fontSize: '20px' }}
              />
            </Badge>
          </Tooltip>
          <Drawer
            title='Giỏ hàng'
            placement={'right'}
            closable={false}
            onClose={() => setIsOpenCart(false)}
            open={isOpenCart}
          >
            <CartItem setIsOpenCart={setIsOpenCart} />
          </Drawer>
          {auth ? (
            <Popover
              placement='bottomRight'
              trigger={'click'}
              content={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Link to={config.routes.user}>
                    <Button
                      type='text'
                      icon={<UserOutlined />}
                      style={{ textAlign: 'left', width: '100%' }}
                    >
                      Trang cá nhân
                    </Button>
                  </Link>
                  <Link to={config.routes.history}>
                    <Button
                      type='text'
                      icon={<HistoryOutlined />}
                      style={{ textAlign: 'left', width: '100%' }}
                    >
                      Lịch sử
                    </Button>
                  </Link>
                  {auth.role_id === 2 || auth.role_id === 4 ? (
                    <Link to={config.routes.registerToBecomeShop}>
                      <Button
                        type='text'
                        icon={<FormOutlined />}
                        style={{ textAlign: 'left', width: '100%' }}
                      >
                        Đăng kí
                      </Button>
                    </Link>
                  ) : auth.role_id === 3 ? (
                    <Link to={config.routes.employee}>
                      <Button
                        type='text'
                        icon={<img src={employee1} width={'14px'} height={'14px'} />}
                        style={{ textAlign: 'left', width: '100%' }}
                      >
                        Nhân viên
                      </Button>
                    </Link>
                  ) : (
                    auth.role_id === 1 && (
                      <Link to={config.routes.admin}>
                        <Button
                          type='text'
                          icon={<RobotOutlined />}
                          style={{ textAlign: 'left', width: '100%' }}
                        >
                          Admin
                        </Button>
                      </Link>
                    )
                  )}
                  {auth.role_id === 4 && (
                    <Link to={config.routes.listShop}>
                      <Button
                        type='text'
                        icon={<ShopOutlined />}
                        style={{ textAlign: 'left', width: '100%' }}
                      >
                        Danh sách cửa hàng
                      </Button>
                    </Link>
                  )}
                  <Button
                    type='text'
                    icon={<LogoutOutlined />}
                    style={{ textAlign: 'left' }}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                </div>
              }
            >
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                icon={<AntDesignOutlined />}
                src={auth.avatar || ''}
                style={{ marginLeft: '20px' }}
              />
            </Popover>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className='ant-btn-customize'
              style={{ marginLeft: '16px' }}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
