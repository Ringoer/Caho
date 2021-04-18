import styles from './register.less';
import { useEffect, useRef, useState } from 'react';
import { connect, history, Link } from 'umi';
import request from '@/util/request';
import { Swal } from '@/util/swal';

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  useEffect(() => {
    if (props.user) {
      history.push('/')
      return
    }
  }, [props.user])

  const username = useRef<HTMLInputElement>(null)
  const nickname = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  const verify = useRef<HTMLInputElement>(null)
  const email = useRef<HTMLInputElement>(null)

  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: '/register', name: '注册新用户' }] })
  }, [])
  const [flag, setFlag] = useState(false)
  const [state, fresh] = useState(0)
  useEffect(() => {
    if (!flag) {
      return
    }
    if (flag) {
      if (!username.current || !nickname.current || !password.current || !verify.current || !email.current) {
        setFlag(false)
        return
      }
      if (!username.current.value || !nickname.current.value || !password.current.value || !verify.current.value || !email.current.value ||
        !(password.current.value === verify.current.value)) {
        fresh(Math.random())
        setFlag(false)
        return
      }
      request('/user/register', {
        method: 'post',
        body: JSON.stringify({
          username: username.current.value,
          nickname: nickname.current.value,
          password: password.current.value,
          email: email.current.value,
        })
      }).then(result => {
        if (result.errno === 0) {
          Swal.success('提交注册成功！\n请前往邮箱，点击注册链接以进行注册验证')
            .then(() => {
              history.push('/login')
            })
          return
        } else {
          Swal.error(result.errmsg)
        }
      })
      setFlag(false)
    }
  }, [flag])
  return (
    <div className={styles.container}>
      <form className={styles.registerForm} onSubmit={event => { event.preventDefault(); setFlag(true) }}>
        <div className={styles.wrapper}>
          <label htmlFor="username">用户名</label>
          <input type="text" name="username" id="username" ref={username} />
          {state !== 0 && !(username.current && username.current.value) ?
            <label htmlFor="username" className={styles.warning}>用户名不能为空！</label> : undefined}
        </div>
        <div className={styles.wrapper}>
          <label htmlFor="nickname">昵称</label>
          <input type="text" name="nickname" id="nickname" ref={nickname} />
          {state !== 0 && !(nickname.current && nickname.current.value) ?
            <label htmlFor="nickname" className={styles.warning}>昵称不能为空！</label> : undefined}
        </div>
        <div className={styles.wrapper}>
          <label htmlFor="password">密码</label>
          <input type="password" name="password" id="password" autoComplete="off" ref={password} />
          {state !== 0 && !(password.current && password.current.value) ?
            <label htmlFor="password" className={styles.warning}>密码不能为空！</label> : undefined}
        </div>
        <div className={styles.wrapper}>
          <label htmlFor="username">确认密码</label>
          <input type="password" name="verify" id="verify" autoComplete="off" ref={verify} />
          {state !== 0 && !(verify.current && password.current && verify.current.value !== '' && verify.current.value === password.current.value) ?
            <label htmlFor="verify" className={styles.warning}>两次密码不一致！</label> : undefined}
        </div>
        <div className={styles.wrapper}>
          <label htmlFor="email">电子邮件</label>
          <input type="email" name="email" id="email" ref={email} />
          {state !== 0 && !(email.current && email.current.value && email.current.value.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) ?
            <label htmlFor="email" className={styles.warning}>电子邮件格式错误！</label> : undefined}
        </div>
        <Link to="/login" className={styles.login}>已有账号？立即登录&gt;&gt;</Link>
        <div className={styles.action}>
          <button className={styles.registerButton}>注册</button>
          <button onClick={event => {
            event.preventDefault()
            if (username.current) {
              username.current.value = ''
            }
            if (nickname.current) {
              nickname.current.value = ''
            }
            if (password.current) {
              password.current.value = ''
            }
            if (verify.current) {
              verify.current.value = ''
            }
            if (email.current) {
              email.current.value = ''
            }
          }} className={styles.resetButton}>重置</button>
        </div>
      </form>
    </div>
  );
})