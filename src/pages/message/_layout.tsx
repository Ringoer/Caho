import styles from './_layout.less';

export default (props: any) => {
  return (
    <div className={styles.main}>
      {props.children}
    </div>
  )
}