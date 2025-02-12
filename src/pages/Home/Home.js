import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useEffect, useContext } from 'react';

import Slider from '~/components/Slider';
import { slider_data } from '~/data/slide';
import { policy } from '~/data/data';
import Moto from '~/components/Moto';
import * as motoServices from '~/api/motoServices';
import { AppContext } from '~/Context/AppContext';
import Toast from '~/components/Toast';

const cx = classNames.bind(styles);
function Home() {
    // const [moto, setMoto] = useState();
    const { dataMoto, setDataMoto, isToastVisible, setIsToastVisible } =
        useContext(AppContext);

    useEffect(() => {
        const fetch = async () => {
            await motoServices
                .getAllXe()
                .then((data) => {
                    setDataMoto(data.data);
                })
                .catch(() => {
                    setIsToastVisible({
                        open: true,
                        type: 'error',
                        message:
                            'Do không có kinh phí nên hiện tại server chưa được deploy. Vui lòng vào trang gitHub để biết thêm chi tiết.',
                        title: 'Lỗi',
                        duration: 10000,
                    });

                    setTimeout(function () {
                        alert(
                            'Link gitHub: https://github.com/Viet-Truong/rent-moto-ui'
                        );
                    }, 10000);
                });
        };

        fetch();
    }, []);

    return (
        <div className={cx('home')}>
            <Slider
                data={slider_data}
                timeOut={5000}
                auto={true}
                control={true}
            />
            <div className={cx('wrapper-policy')}>
                {policy.map((item) => (
                    <div className={cx('policy__card')} key={item.id}>
                        <div className={cx('policy__icon')}>{item.icon}</div>
                        <div className={cx('policy__info')}>
                            <h4 className={cx('policy__title')}>{item.name}</h4>
                            <p className={cx('policy__description')}>
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className={cx('main-content')}>
                <h2 className={cx('content__title')}>
                    TẤT CẢ CÁC XE ĐANG ĐƯỢC CHO THUÊ
                </h2>
                <div className={cx('wrapper-car')}>
                    {dataMoto?.map((item, index) => {
                        return (
                            <figure key={index}>
                                <Moto
                                    img={item.hinhAnh}
                                    name={item.tenXe}
                                    price={item.giaThue}
                                    slug={item.slug}
                                />
                            </figure>
                        );
                    })}
                </div>
            </div>
            <Toast
                type={isToastVisible?.type}
                message={isToastVisible?.message}
                title={isToastVisible?.title}
                duration={isToastVisible?.duration}
            />
        </div>
    );
}

export default Home;
