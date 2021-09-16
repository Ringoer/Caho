import { FC } from 'react';
import ReactDOM from 'react-dom';
import styles from './Popup.less';

interface PopupProps {
  hide?: boolean;
  children: any;
}

const Popup: FC<PopupProps> & {
  show: (children: any) => void;
  close: (children: any) => void;
} = (props: PopupProps) => {
  const { hide = false } = props;

  return (
    <div
      className={styles.popup}
      style={{ display: hide ? 'none' : 'flex' }}
      onClick={Popup.close}
    >
      {props.children}
    </div>
  );
};

Popup.show = (children: FC<any>) => {
  const container =
    document.getElementById('popupContainer') || document.createElement('div');
  container.id = 'popupContainer';
  document.body.append(container);
  ReactDOM.render(<Popup>{children}</Popup>, container);
};
Popup.close = () => {
  const container = document.getElementById('popupContainer');
  if (container) {
    container.remove();
  }
};

export default Popup;
