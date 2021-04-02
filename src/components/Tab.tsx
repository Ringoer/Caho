import styles from './Tab.less'

export default (props: any) => {
  return (
    <div className={styles.tab}>
      {props.children}
    </div>
  )
}