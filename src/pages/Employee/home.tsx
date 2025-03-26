import classNames from 'classnames/bind';
import styles from '@/scss/pages/employee/employeeHome.module.scss';

const cx = classNames.bind(styles);
const home = () => {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('wrapper_header')}></div>
    </div>
  );
};

export default home;
