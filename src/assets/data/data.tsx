import {
  CustomerServiceOutlined,
  GiftOutlined,
  PayCircleOutlined,
  SketchOutlined,
} from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

export interface IPolicy {
  id: number;
  name: string;
  description: string;
  icon: React.ForwardRefExoticComponent<
    Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
  >;
}
export const policy = [
  {
    id: 1,
    name: 'Ưu đãi',
    description: 'Nhiều ưu đãi giảm giá',
    icon: <GiftOutlined />,
  },
  {
    id: 2,
    name: 'Thanh toán',
    description: 'Thanh toán khi nhận xe',
    icon: <PayCircleOutlined />,
  },
  {
    id: 3,
    name: 'Khách hàng VIP',
    description: 'Ưu đãi cho khách hàng VIP',
    icon: <SketchOutlined />,
  },
  {
    id: 4,
    name: 'Hỗ trợ',
    description: 'Hỗ trợ nhiệt tình, tận tâm',
    icon: <CustomerServiceOutlined />,
  },
];

export interface IViolation {
  id: number;
  name: string;
}

export const violation = [
  {
    id: 1,
    name: 'Mất xe',
  },
  {
    id: 2,
    name: 'Trễ hạn',
  },
  {
    id: 3,
    name: 'Hư phụ tùng',
  },
  {
    id: 4,
    name: 'Trầy xước xe',
  },
];
