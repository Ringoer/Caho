import styles from './Label.less'

export default (props: any) => {
  const { color = 'white', backgroundColor = "#5CD1F0" } = props
  return (
    <div
      className={styles.tag}
      style={{
        color,
        backgroundColor
      }}
    >
      {props.children}
    </div>
  )
}