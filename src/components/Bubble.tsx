import styles from './Bubble.less';

interface BubbleProps {
  color?: string;
  children: any;
}

const Bubble = (props: BubbleProps) => {
  const { color = 'white' } = props;
  return (
    <div
      className={styles.bubble}
      style={{
        backgroundColor: color,
        borderColor: color,
      }}
    >
      {props.children}
    </div>
  );
};

export default Bubble;
