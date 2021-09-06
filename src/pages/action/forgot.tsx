import styles from './forgot.less';
import { useEffect, useRef, useState } from 'react';
import { connect, history, Link } from 'umi';
import request from '@/util/request';
import { Swal } from '@/util/swal';
import Button from '@/components/Button';

export default connect(
  ({ user, breadcrumb }: { user: User; breadcrumb: Breadcrumb[] }) => ({
    user,
    breadcrumb,
  }),
)((props: any) => {
  const { user } = props;

  useEffect(() => {
    if (user) {
      history.push('/');
      return;
    }
  }, [user]);

  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const verify = useRef<HTMLInputElement>(null);

  useEffect(() => {
    props.dispatch({
      type: 'breadcrumb/info',
      payload: [{ index: 1, pathname: '/forgot', name: '[功能] 找回账户' }],
    });
  }, []);
  const [flag, setFlag] = useState(false);
  const [state, fresh] = useState(0);
  useEffect(() => {
    if (!flag) {
      return;
    }

    if (!username.current || !password.current || !verify.current) {
      setFlag(false);
      return;
    }
    if (
      !username.current.value ||
      !password.current.value ||
      !verify.current.value ||
      !(password.current.value === verify.current.value)
    ) {
      fresh(Math.random());
      setFlag(false);
      Swal.error('参数错误');
      return;
    }
    request('/user/forgot', {
      method: 'post',
      body: JSON.stringify({
        username: username.current.value,
        password: password.current.value,
      }),
    }).then((result) => {
      if (result.errno === 0) {
        Swal.success(
          '提交找回密码请求成功！\n请前往邮箱，点击注册链接以进行验证',
        ).then(() => {
          history.push('/login');
        });
        return;
      } else {
        Swal.error(result.errmsg);
      }
    });
    setFlag(false);
  }, [flag]);
  return (
    <div className={styles.container}>
      <form
        className={styles.registerForm}
        onSubmit={(event) => {
          event.preventDefault();
          setFlag(true);
        }}
      >
        <div className={styles.wrapper}>
          <label htmlFor="username">用户名</label>
          <input type="text" name="username" id="username" ref={username} />
          {state !== 0 && !(username.current && username.current.value) ? (
            <label htmlFor="username" className={styles.warning}>
              用户名不能为空！
            </label>
          ) : undefined}
        </div>
        <div className={styles.wrapper}>
          <label htmlFor="password">新密码</label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="off"
            ref={password}
          />
          {state !== 0 && !(password.current && password.current.value) ? (
            <label htmlFor="password" className={styles.warning}>
              密码不能为空！
            </label>
          ) : undefined}
        </div>
        <div className={styles.wrapper}>
          <label htmlFor="username">确认密码</label>
          <input
            type="password"
            name="verify"
            id="verify"
            autoComplete="off"
            ref={verify}
          />
          {state !== 0 &&
          !(
            verify.current &&
            password.current &&
            verify.current.value !== '' &&
            verify.current.value === password.current.value
          ) ? (
            <label htmlFor="verify" className={styles.warning}>
              两次密码不一致！
            </label>
          ) : undefined}
        </div>
        <Link to="/login" className={styles.login}>
          已有账号？立即登录&gt;&gt;
        </Link>
        <div className={styles.action}>
          <Button>发送邮件</Button>
          <Button
            backgroundColor="white"
            color="black"
            onClick={(event) => {
              event.preventDefault();
              if (username.current) {
                username.current.value = '';
              }
              if (password.current) {
                password.current.value = '';
              }
              if (verify.current) {
                verify.current.value = '';
              }
            }}
          >
            重置
          </Button>
        </div>
      </form>
    </div>
  );
});
