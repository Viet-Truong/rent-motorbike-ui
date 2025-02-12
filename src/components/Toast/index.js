import classNames from 'classnames/bind';
import styles from './Toast.module.scss';
import { useEffect, useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faClose,
    faExclamation,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';

import { AppContext } from '~/Context/AppContext';

const cx = classNames.bind(styles);
const icons = {
    success: <FontAwesomeIcon icon={faCheck} />,
    warning: <FontAwesomeIcon icon={faExclamation} />,
    error: <FontAwesomeIcon icon={faXmark} />,
};
function Toast({ type, title, message, duration = 3000 }) {
    // const [openToast, setOpenToast] = useState(() => Boolean(open));
    const { isToastVisible, setIsToastVisible } = useContext(AppContext);
    const isClose = isToastVisible.open ? '' : 'close';

    useEffect(() => {
        if (isToastVisible.open) {
            const timer = setTimeout(() => {
                setIsToastVisible({
                    open: false,
                });
            }, duration);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [isToastVisible.open]);

    return (
        <div className={cx('toast-wrapper', `${isClose}`)}>
            <div className={cx('toast', `toast--${type}`)}>
                <div className={cx('toast__icon')}>
                    {type === 'success' ? icons.success : icons.error}
                </div>
                <div className={cx('toast__body')}>
                    <h3 className={cx('toast__title')}>{title}</h3>
                    <p className={cx('toast__msg')}>{message}</p>
                </div>
                <div className={cx('toast__close')}>
                    <FontAwesomeIcon
                        icon={faClose}
                        onClick={() =>
                            setIsToastVisible({
                                open: false,
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default Toast;
