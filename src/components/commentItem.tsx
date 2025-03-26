import classNames from 'classnames/bind';
import styles from '@/scss/components/commentItem.module.scss';
import { Rate } from 'antd';
import dayjs from 'dayjs';
import { Evaluate } from '@/type/motorbike';

const cx = classNames.bind(styles);

const formatName = (name: string) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) {
    return `${name.charAt(0)}${'*'.repeat(name.length - 2)}${name.charAt(name.length - 1)}`;
  } else {
    return `${parts[0].charAt(0)}${'*'.repeat(parts[0].length - 1)} ${parts[
      parts.length - 1
    ].charAt(0)}${'*'.repeat(parts[parts.length - 1].length - 1)}`;
  }
};

const CommentItem = ({ item }: { item: Evaluate }) => {
  const displayName = item.inPrivate ? formatName(item.fullName) : item.fullName;
  return (
    <div className={cx('wrapper')}>
      <div className={cx('wrapper_header')}>
        <div className=''>
          <div>{displayName}</div>
          <div className={cx('title')}>{item.title}</div>
        </div>
        <div>
          <div className={cx('time')}>{dayjs(item.created_at).format('HH:mm DD/MM/YYYY')}</div>
          <Rate disabled defaultValue={item.star} />
        </div>
      </div>
      <div className={cx('body')}>
        <p>{item.content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
