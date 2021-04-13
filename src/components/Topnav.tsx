import styles from './Topnav.less'
import { connect, history, Link } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';
import Loading from './Loading';

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] } = props

  function logout() {
    props.dispatch({ type: 'user/info', payload: null })
    request('/user/logout', {
      method: 'post'
    })
    history.push('/')
  }

  useEffect(() => {
    if (!user) {
      request('/user/info')
        .then(result => {
          if (result.errno === 0) {
            const { data } = result
            data.score = 0
            props.dispatch({ type: 'user/info', payload: data })
          } else {
            alert(result.errmsg)
            console.error(result.errmsg)
          }
        })
    } else {
      console.log(`no cookie found`)
    }
  }, [])
  return (
    <header className={styles.header}>
      <div className={styles.topnav}>
        <div className={styles.goto}>
          <a href="/" className={styles.logo}>
            <img src={require('@/assets/logo.png')} alt="logo" />
          </a>
          {breadcrumb.length > 1 ? (
            <Link to={breadcrumb[breadcrumb.length - 2].pathname} className={styles.back}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-left"></use>
              </svg>
            </Link>) : undefined}
        </div>
        <div className={styles.forumName}>
          {!breadcrumb[breadcrumb.length - 1] ? <Loading /> : (
            <span>{breadcrumb[breadcrumb.length - 1].name}</span>
          )}
        </div>
        <div className={styles.menu}>
          <ul className={styles.pcMenu}>
            <li className={styles.menuItem}>
              {user ?
                <Link to={`/user/${user.id}`} className={styles.link}>
                  <div className={styles.mask}></div>
                  <span>{user.nickname}</span>
                </Link> :
                <Link to='/login' className={styles.link}>
                  <div className={styles.mask}></div>
                  <span>登录</span>
                </Link>}
            </li>
            <li className={styles.menuItem}>
              <Link to='/settings' className={styles.link}>
                <div className={styles.mask}></div>
                <span>设置</span>
              </Link>
            </li>
            {user ?
              <li className={styles.menuItem}>
                <a className={styles.link} onClick={logout}>
                  <div className={styles.mask}></div>
                  <span>退出</span>
                </a>
              </li> : undefined}
          </ul>
          <ul className={styles.mobileMenu}>
            {user ?
              <li className={styles.menuItem}>
                <a className={styles.link} onClick={logout}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-exit"></use>
                  </svg>
                </a>
              </li> : undefined}
          </ul>
        </div>
      </div>
      <div className={styles.banner}>
        <img src={require('@/assets/bg_pic.jpg')} alt="首页头图" />
      </div>
    </header>
  )
})