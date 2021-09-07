import { useState } from 'react';
import styles from './Image.less';
import Popup from './Popup';

interface ImageProps {
  src: string;
  scale?: number;
  onClick?: (src: string) => void;
}

const Image = (props: ImageProps) => {
  const { src, scale = 200, onClick } = props;

  const [hide, setHide] = useState(true);

  return (
    <div
      className={styles.container}
      style={{ width: scale, height: scale }}
      onClick={
        onClick
          ? (event) => {
              event.preventDefault();
              onClick(src);
            }
          : (event) => {
              event.preventDefault();
              setHide(!hide);
            }
      }
    >
      <img src={src} alt="图片展示" />
      <Popup hide={hide}>
        <img src={src} alt="图片" />
      </Popup>
    </div>
  );
};

export default Image;
