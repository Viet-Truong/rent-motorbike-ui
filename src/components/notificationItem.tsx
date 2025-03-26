import classNames from 'classnames/bind';
import styles from '@/scss/components/notification.module.scss';

interface INotificationProps {
  rental_id: number;
  time: string;
}

const cx = classNames.bind(styles);
const NotificationItem = ({ rental_id, time }: INotificationProps) => {
  return (
    <div className={cx('wrapper')}>
      <p className={cx('time')}>{time}</p>
      <p className={cx('message')}>
        <span style={{ color: '#24c7c8' }}>[#{rental_id}]</span> Có đơn thuê mới. Vui lòng kiểm tra!
      </p>
    </div>
  );
};

export default NotificationItem;
