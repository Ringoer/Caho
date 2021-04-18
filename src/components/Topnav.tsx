import styles from './Topnav.less'
import { connect, history, Link } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';
import Loading from './Loading';
import { Swal } from '@/util/swal';

export default connect(({ user, breadcrumb, login }: { user: User, breadcrumb: Breadcrumb[], login: string }) => ({ user, breadcrumb, login }))((props: any) => {
  const { user, breadcrumb, login }: { user: User, breadcrumb: Breadcrumb[], login: string } = props
  const [sign, setSign] = useState(false)

  function logout() {
    props.dispatch({ type: 'user/info', payload: null })
    props.dispatch({ type: 'login/info', payload: 'unlogin' })
    request('/user/logout', {
      method: 'post'
    }).then(() => {
      history.push('/')
    })
  }

  function onSign() {
    if (sign) {
      Swal.info('您今天已经签过到了！')
      return
    }
    if (!user) {
      return
    }
    request('/score/sign', {
      method: 'post',
    }).then(result => {
      if (result.errno === 0) {
        Swal.success('签到成功！')
          .then(() => {
            setSign(true)
            location.reload()
          })
      }
    })
  }

  useEffect(() => {
    if (!user) {
      console.log(`no cookie found`)
    }
    request('/user/info')
      .then(result => {
        if (result.errno === 0) {
          const { data } = result
          if (!data) {
            return
          }
          request(`/score?userid=${data.id}`)
            .then(result => {
              if (result.errno === 0) {
                const { data: score } = result
                data.score = score || 0
                props.dispatch({ type: 'user/info', payload: data })
                props.dispatch({ type: 'login/info', payload: 'login' })
              }
            })
        } else {
          props.dispatch({ type: 'login/info', payload: 'unlogin' })
        }
      })
  }, [login])

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
            {user ?
              <>
                <li className={styles.menuItem}>
                  <Link to={`/user/${user.id}`} className={styles.link}>
                    <div className={styles.mask}></div>
                    <span>{user.nickname}</span>
                  </Link>
                </li>
                <li className={styles.menuItem}>
                  <a className={styles.link} onClick={onSign}>
                    <div className={styles.mask}></div>
                    <span>{sign ? '已签到' : '签到'}</span>
                  </a>
                </li>
                {/* <li className={styles.menuItem}>
                  <Link to='/settings' className={styles.link}>
                    <div className={styles.mask}></div>
                    <span>设置</span>
                  </Link>
                </li> */}
                <li className={styles.menuItem}>
                  <a className={styles.link} onClick={logout}>
                    <div className={styles.mask}></div>
                    <span>退出</span>
                  </a>
                </li>
              </>
              :
              <li className={styles.menuItem}>
                <Link to='/login' className={styles.link}>
                  <div className={styles.mask}></div>
                  <span>登录</span>
                </Link>
              </li>
            }
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