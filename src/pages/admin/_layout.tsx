import styles from './_layout.less'
import { connect, Link, history } from 'umi'
import { useEffect } from 'react'

const actions: { name: string, path: string }[] = [
  { name: '查看版块', path: '/admin/forum' },
  { name: '查看日志', path: '/admin/log' },
  { name: '查看主题', path: '/admin/topic' },
  { name: '查看用户', path: '/admin/user' },
]

export default connect(({ user, breadcrumb, login }: { user: User, breadcrumb: Breadcrumb, login: string }) => ({ user, breadcrumb, login }))((props: any) => {
  const { user, login }: { user: User, login: string } = props

  useEffect(() => {
    if (!login) {
      return
    }
    if (login !== 'login') {
      history.push('/404')
      return
    }
    if (!user || user.roleId !== 2) {
      history.push('/404')
      return
    }
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: location.pathname, name: '管理员主页' }] })
  }, [user, login])

  return (
    <div className={styles.main}>
      {user && user.roleId === 2 ? (
        <ul>
          {actions.map(action => (
            <li key={action.path}>
              <Link to={action.path}>{action.name}</Link>
            </li>
          ))}
        </ul>
      ) : undefined}
    </div>
  )
})