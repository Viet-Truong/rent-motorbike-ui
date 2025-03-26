import styles from '@/scss/defaultLayout.module.scss';
import classNames from 'classnames/bind';

import Footer from '../components/footer';
import Header from '../components/header';
import { FC } from 'react';

const cx = classNames.bind(styles);
const DefaultLayout: FC<{ children: React.ReactNode | JSX.Element }> = ({ children }) => {
  return (
    <div className={cx('wrapper')}>
      <Header />
      <div className={cx('container')}>{children}</div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
