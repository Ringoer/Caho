import styles from './Popup.less';

interface PopupProps {
  hide?: boolean;
  children: any;
}

const Popup = (props: PopupProps) => {
  const { hide = false } = props;
  return (
    <div className={styles.popup} style={{ display: hide ? 'none' : 'flex' }}>
      {props.children}
    </div>
  );
};

export default Popup;
