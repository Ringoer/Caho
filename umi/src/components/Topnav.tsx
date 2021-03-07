import styles from './Topnav.less'
import { connect, Link } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';

const getTopmenu = new Promise(resolve => {
  resolve({
    json: () => ({
      data: [
        { id: 1, name: 'username', href: '/home' },
        { id: 2, name: '设置', href: '/settings' },
      ]
    })
  })
})

export default connect(({ user, breadcrumb }: { user: any, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { breadcrumb } = props
  const defaultUser = Object.assign({}, props.user)
  const [user, setUser] = useState(defaultUser)
  const [topmenu, setTopmenu] = useState([])
  useEffect(() => {
    request('/user/Ringoer')
      .then(result => {
        const { data } = result
        console.log(data)
        setUser(data || defaultUser)
        props.dispatch({ type: 'user/info', payload: data })
        return data
      })
      .then(user => {
        // fetch('/api/topmenu')
        getTopmenu
          .then((res: any) => res.json())
          .then(result => {
            const { data } = result
            setTopmenu(data.map((item: any) => {
              if (item.name === 'username') item.name = user.loginname
              return item
            }))
          })
      })
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
          <span>{breadcrumb[breadcrumb.length - 1] && breadcrumb[breadcrumb.length - 1].name}</span>
        </div>
        <div className={styles.menu}>
          <ul className={styles.pcMenu}>
            {topmenu.map((item: any) => (
              <li className={styles.menuItem} key={item.id}>
                <Link to={item.href} className={styles.link}>
                  <div className={styles.mask}></div>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className={styles.mobileMenu}>
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
          </ul>
        </div>
      </div>
      <div className={styles.banner}>
        <img src={require('@/assets/bg_pic.jpg')} alt="首页头图" />
      </div>
    </header>
  )
})