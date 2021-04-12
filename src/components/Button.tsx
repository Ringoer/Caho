import styles from './Button.less'

export default (props: any) => {
  const { backgroundColor, color, onClick, type } = props
  return (
    <>
      {type === 'plain' ?
        <button className={styles.button} onClick={onClick} style={{
          backgroundColor: 'white',
          color: 'grey',
          border: 'none'
        }}>
          <div className={styles.mask} />
          {props.children}
        </button>
        :
        <button className={styles.button} onClick={onClick} style={{
          backgroundColor: backgroundColor ? backgroundColor : '#5CD1F0',
          color: color ? color : 'white'
        }}>
          <div className={styles.mask} />
          {props.children}
        </button>
      }
    </>
  )
}