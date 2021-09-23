import styles from './Bubble.less';

interface BubbleProps {
  color?: string;
  children: any;
  className?: string;
}

const Bubble = (props: BubbleProps) => {
  const { color = 'white', className = '' } = props;
  return (
    <div
      className={[styles.bubble, className].join(' ')}
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
