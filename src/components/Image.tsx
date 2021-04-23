import { useState } from 'react';
import styles from './Image.less';
import Popup from './Popup';

export default (props: any) => {
  const { src, scale = '200px', } = props

  const [hide, setHide] = useState(true)

  return (
    <div
      className={styles.container}
      style={{ width: scale, height: scale }}
      onClick={() => setHide(!hide)}
    >
      <img src={src} alt="图片展示" />
      <Popup hide={hide}>
        <img src={src} alt="图片" />
      </Popup>
    </div>
  )
}