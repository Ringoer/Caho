import styles from './Loading.less'

export default () => {
  return (
    <div className={styles.loading}>
      <svg className="icon" aria-hidden="true">
        <use xlinkHref="#icon-loading"></use>
      </svg>
    </div>
  )
}