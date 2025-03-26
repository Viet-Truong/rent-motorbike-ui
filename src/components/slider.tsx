import { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from '@/scss/components/slider.module.scss';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { sliderData } from '@/assets/data/slider';

interface SliderProps {
  data: sliderData[];
  timeOut: number;
  auto: boolean;
  control: boolean;
}

const cx = classNames.bind(styles);
function Slider(props: SliderProps) {
  // activeSlide la` bien de biet slide nao` dang dc hien thi
  const [activeSlide, setActiveSlide] = useState(0);

  // neu props.timeOut === true thi se lay timeOut false thi 3s
  const timeOut = props.timeOut ? props.timeOut : 3000;

  const nextSlide = useCallback(() => {
    const index = activeSlide + 1 === props.data.length ? 0 : activeSlide + 1;
    setActiveSlide(index);
  }, [activeSlide, props.data]);

  const prevSlide = () => {
    const index = activeSlide - 1 < 0 ? props.data.length - 1 : activeSlide - 1;
    setActiveSlide(index);
  };

  useEffect(() => {
    if (props.auto) {
      const slideAuto = setInterval(() => {
        nextSlide();
      }, timeOut);
      return () => {
        clearInterval(slideAuto);
      };
    }
  }, [nextSlide, timeOut, props]);

  return (
    <>
      <div className={cx('slider')}>
        {props.data.map((item, index) => (
          <SliderItem key={index} item={item} active={index === activeSlide} />
        ))}
        {props.control ? (
          <div className={cx('slider__control')}>
            <div className={cx('slider__control__item')} onClick={prevSlide}>
              <LeftOutlined className={cx('slider__control__icon')} />
            </div>
            <div className={cx('slider__control__item')}>
              <div className={cx('index')}>{activeSlide + 1}</div>
            </div>
            <div className={cx('slider__control__item')} onClick={nextSlide}>
              <RightOutlined className={cx('slider__control__icon')} />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

interface SliderItemProps {
  item: sliderData;
  active: boolean;
}

const SliderItem = (props: SliderItemProps) => (
  <div className={cx('slider-item', `${props.active ? 'active' : ''}`)}>
    <div className={cx('slider-item__info')}>
      <div className={cx('slider-item__info__title')}>
        <span>{props.item.title}</span>
      </div>
      <div className={cx('slider-item__info__description')}>
        <span>{props.item.description}</span>
      </div>
    </div>
    <div className={cx('slider-item__image')}>
      <div className={cx('shape-item')}></div>
      <img src={props.item.img} alt={'image-item'} width={400} />
    </div>
  </div>
);

export default Slider;
