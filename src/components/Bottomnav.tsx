import styles from './Bottomnav.less'
import { connect, history, Link } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';
import Loading from './Loading';

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user } = props
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
            <Link to="/search" className={styles.link}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-search"></use>
              </svg>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link to="/message" className={styles.link}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-ring"></use>
              </svg>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link to={user ? `/user/${user.id}` : '/login'} className={styles.link}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-person"></use>
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
})