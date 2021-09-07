import styles from './Note.less';

const Note = (props: any) => {
  return <div className={styles.note}>{props.children}</div>;
};

export default Note;
