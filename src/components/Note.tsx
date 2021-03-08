import styles from './Note.less'

export default (props: any) => {
  return (
    <div className={styles.note}>
      {props.children}
    </div>
  )
}