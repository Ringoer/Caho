import styles from './Label.less';

interface LabelProps {
  color?: string;
  backgroundColor?: string;
  children: any;
}

const Label = (props: LabelProps) => {
  const { color = 'white', backgroundColor = '#5CD1F0' } = props;
  return (
    <div
      className={styles.label}
      style={{
        color,
        backgroundColor,
      }}
    >
      {props.children}
    </div>
  );
};

export default Label;
