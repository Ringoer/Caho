import styles from './login.less';
import { useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import request from '@/util/request';

export default connect(({ user, breadcrumb, login }: { user: User, breadcrumb: Breadcrumb[], login: string }) => ({ user, breadcrumb, login }))((props: any) => {
  useEffect(() => {
    if (props.user) {
      history.push('/')
      return
    }
  }, [props.user])

  const username = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)

  const [flag, setFlag] = useState(false)
  const [state, fresh] = useState(0)
  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: '/login', name: '用户登录' }] })
  }, [])
  useEffect(() => {
    if (!flag) {
      return
    }
    if (flag) {
      if (!username.current || !password.current) {
        setFlag(false)
        return
      }
      request('/user/login', {
        method: 'post',
        body: JSON.stringify({
          username: username.current.value,
          password: password.current.value
        })
      }).then(result => {
        if (result.errno === 0) {
          props.dispatch({ type: 'login/info', payload: '0' })
          history.push('/')
          return
        } else {
          alert('用户名或密码错误！\n是否尚未确认邮箱的注册链接？')
          return
        }
      })
      setFlag(false)
    }
  }, [flag])
  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={event => { event.preventDefault(); setFlag(true) }}>
        <div className={styles.wrapper}>
          <label htmlFor="username">用户名</label>
          <input type="text" name="username" id="username" ref={username} onChange={() => fresh(Math.random())} />
          {state !== 0 && !(username.current && username.current.value) ? <label htmlFor="username" className={styles.warning}>用户名不能为空！</label> : undefined}
        </div>
        <div className={styles.wrapper}>
          <label htmlFor="password">密码</label>
          <input type="password" name="password" id="password" autoComplete="off" ref={password} onChange={() => fresh(Math.random())} />
          {state !== 0 && !(password.current && password.current.value) ? <label htmlFor="password" className={styles.warning}>密码不能为空！</label> : undefined}
        </div>
        <div className={styles.action}>
          <button className={styles.loginButton}>登录</button>
          <button onClick={event => { history.push('/register'); event.preventDefault() }} className={styles.registerButton}>注册</button>
        </div>
      </form>
    </div>
  );
})