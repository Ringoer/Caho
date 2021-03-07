import styles from './Note.less'

export default (props: any) => {
  return (
    <div className={styles.note + (localStorage.getItem('device') === 'pc' ? '' : ' ' + styles.mobile)}>
      {props.children}
    </div>
  )
}