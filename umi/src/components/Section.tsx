import styles from './Section.less'

export default (props: any) => {
  const color = props.color || '#5CD1F0'
  return (
    <div className={styles.section}>
      <div className={styles.title} style={{ background: color, borderColor: color }} >
        {props.title}
      </div>
      <div className={styles.content}>
        {props.children}
      </div>
    </div>
  )
}