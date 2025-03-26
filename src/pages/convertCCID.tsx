import classNames from 'classnames/bind';
import styles from '@/scss/pages/login.module.scss';
import { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';

const cx = classNames.bind(styles);

const ConvertTextFromCCID = () => {
  const [selectedImage, setSelectedImage] = useState<File>();
  const [textResult, setTextResult] = useState<string>();

  const worker = createWorker('vie');

  const convertCCIDToText = async () => {
    if (selectedImage) {
      const ret = await (await worker).recognize(selectedImage);
      setTextResult(ret.data.text);
      (await worker).terminate();
    }
  };

  useEffect(() => {
    convertCCIDToText();
  }, [selectedImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedImage(e.target.files[0]);
  };
  return (
    <div className={cx('wrapper')}>
      <div className={cx('input-wrapper')}>
        <label htmlFor='upload'>Tải lên CCID 2 mặt</label>
        <input type='file' id='upload' accept='image/*' onChange={handleChange} />
      </div>
      <div className={cx('result')}>
        {selectedImage && <div className={cx('box-image')}>{textResult}</div>}
      </div>
    </div>
  );
};

export default ConvertTextFromCCID;
