import styles from './Section.less';

interface SectionProps {
  color?: string;
  title: string;
  children: any;
}

const Section = (props: SectionProps) => {
  const { color = '#5CD1F0', title } = props;
  return (
    <div className={styles.section}>
      <div
        className={styles.title}
        style={{ background: color, borderColor: color }}
      >
        {title}
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default Section;
