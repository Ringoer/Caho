import styles from './Loading.less';

const Loading = () => {
  return (
    <div className={styles.loading}>
      <svg className="icon" aria-hidden="true">
        <use xlinkHref="#icon-loading"></use>
      </svg>
    </div>
  );
};

export default Loading;
