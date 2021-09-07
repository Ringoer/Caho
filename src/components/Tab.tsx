import styles from './Tab.less';

interface TabProps {
  title: string;
  name: string;
  children: any;
}

const Tab = (props: TabProps) => {
  return <div className={styles.tab}>{props.children}</div>;
};

export default Tab;
