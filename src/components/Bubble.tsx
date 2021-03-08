import styles from './Bubble.less'
export default (props: any) => {
  const { color } = props
  return (
    <div className={styles.bubble} style={{
      backgroundColor: color ? color : 'white',
      borderColor: color ? color : 'white'
    }}>
      {props.children}
    </div>
  )
}