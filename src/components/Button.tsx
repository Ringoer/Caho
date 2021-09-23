import styles from './Button.less';

interface ButtonProps {
  backgroundColor?: string;
  color?: string;
  onClick?: (event: any) => void;
  type?: string;
  children: any;
  className?: any;
}

const Button = (props: ButtonProps) => {
  const {
    backgroundColor = '#5CD1F0',
    color = 'white',
    onClick = () => {},
    type,
    className = '',
  } = props;
  return (
    <button
      className={[styles.button, className].join(' ')}
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

export default Button;
