import styles from './Bottomnav.less';
import { connect, Link } from 'umi';

const Bottomnav = connect(({ user }: { user: User }) => ({ user }))(
  (props: { user: User }) => {
    const { user } = props;

    return (
      <div className={styles.bottom}>
        <div className={styles.bottomNav}>
          <ul className={styles.navList}>
            <li className={styles.menuItem}>
              <Link to="/" className={styles.link}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-home"></use>
                </svg>
              </Link>
            </li>
            <li className={styles.menuItem}>
              <Link to={user ? '/message' : '/login'} className={styles.link}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-ring"></use>
                </svg>
              </Link>
            </li>
            <li className={styles.menuItem}>
              <Link
                to={user ? `/user/${user.id}` : '/login'}
                className={styles.link}
              >
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-person"></use>
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  },
);

export default Bottomnav;
