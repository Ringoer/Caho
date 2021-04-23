import styles from './Popup.less'

export default (props: any) => {
  const { hide = false } = props
  return (
    <div
      className={styles.popup}
      style={{ display: hide ? 'none' : 'flex' }}
    >
      {props.children}
    </div>
  )
}