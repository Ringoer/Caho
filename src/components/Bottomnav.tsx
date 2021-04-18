import styles from './Bottomnav.less'
import { connect, history, Link } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';
import Loading from './Loading';

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user } = props
  const [sign, setSign] = useState(false)

  function onSign() {
    if (!user) {
      return
    }
    if (sign) {
      alert('您今天已经签过到了')
      return
    }
    request('/score/sign', {
      method: 'post',
    }).then(result => {
      if (result.errno === 0) {
        alert('签到成功！')
        setSign(true)
        location.href = '/'
      }
    })
  }

  useEffect(() => {
    if (!user) {
      return
    }
    request('/score/sign')
      .then(result => {
        if (result.errno === 0) {
          const { data } = result
          if (typeof data === 'boolean') {
            setSign(data)
          }
        }
      })
  }, [user])

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
            <a className={styles.link} onClick={onSign}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-sign"></use>
              </svg>
            </a>
          </li>
          {/* <li className={styles.menuItem}>
            <Link to="/message" className={styles.link}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-ring"></use>
              </svg>
            </Link>
          </li> */}
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