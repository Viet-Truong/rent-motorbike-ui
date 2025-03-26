import classNames from 'classnames/bind';
import styles from '@/scss/pages/shop/shopHome.module.scss';

const cx = classNames.bind(styles);

const Home = () => {
  return (
    <>
      <div className={cx('wrapper')}>
        <div className={cx('wrapper_header')}></div>
      </div>
    </>
  );
};

export default Home;
