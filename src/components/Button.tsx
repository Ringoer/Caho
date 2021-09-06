import styles from './Button.less';

interface ButtonProps {
  backgroundColor?: string;
  color?: string;
  onClick?: (event: any) => void;
  type?: string;
  children: any;
  className?: any;
}

export default (props: ButtonProps) => {
  const {
    backgroundColor = '#5CD1F0',
    color = 'white',
    onClick = () => {},
    type,
  } = props;
  return (
    <button
      className={styles.button}
      onClick={onClick}
      style={{
        backgroundColor: backgroundColor,
        color: color,
        ...(type === 'plain'
          ? {
              backgroundColor: 'white',
              color: 'grey',
              border: 'none',
            }
          : {}),
      }}
    >
      <div className={styles.mask} />
      {props.children}
    </button>
  );
};
