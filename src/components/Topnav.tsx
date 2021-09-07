import styles from './Topnav.less';
import { connect, Link } from 'umi';
import { useEffect } from 'react';
import request from '@/util/request';
import Loading from './Loading';
import { Swal } from '@/util/swal';

interface TopnavProps {
  user: User;
  breadcrumb: Breadcrumb[];
  login: string;
  dispatch: (option: { type: string; payload: any }) => void;
}

const Topnav = connect(({ user, breadcrumb, login }: TopnavProps) => ({
  user,
  breadcrumb,
  login,
}))((props: TopnavProps) => {
  const { user, breadcrumb, login } = props;

  function logout() {
    props.dispatch({ type: 'user/info', payload: null });
    props.dispatch({ type: 'follow/info', payload: null });
    props.dispatch({ type: 'login/info', payload: 'unlogin' });
    request('/user/logout', {
      method: 'post',
    }).then(() => {
      Swal.success('您已退出').then(() => {
        location.reload();
      });
    });
  }

  useEffect(() => {
    if (!user) {
      console.log(`no cookie found`);
    }
    request('/user/info').then((result) => {
      if (result.errno === 0) {
        const { data } = result;
        if (!data) {
          return;
        }
        request(`/score?userId=${data.id}`).then((result) => {
          if (result.errno === 0) {
            const { data: score } = result;
            data.score = score || 0;
            props.dispatch({ type: 'user/info', payload: data });
            props.dispatch({ type: 'login/info', payload: 'login' });
          }
        });
        request(`/user/${data.id}/follow`).then((result) => {
          if (result.errno === 0) {
            const { follows } = result.data;
            props.dispatch({ type: 'follow/info', payload: follows });
          }
        });
      } else {
        props.dispatch({ type: 'login/info', payload: 'unlogin' });
      }
    });
  }, [login]);

  return (
    <header className={styles.header}>
      <div className={styles.topnav}>
        <div className={styles.goto}>
          <a href="/" className={styles.logo}>
            <img
              src="https://ali.ringoer.com/cdn/caho/banner/logo.png"
              alt="logo"
            />
          </a>
          {breadcrumb.length > 1 ? (
            <Link
              to={breadcrumb[breadcrumb.length - 2].pathname}
              className={styles.back}
            >
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-left"></use>
              </svg>
            </Link>
          ) : undefined}
        </div>
        <div className={styles.forumName}>
          {!breadcrumb[breadcrumb.length - 1] ? (
            <Loading />
          ) : (
            <span>{breadcrumb[breadcrumb.length - 1].name}</span>
          )}
        </div>
        <div className={styles.menu}>
          <ul className={styles.pcMenu}>
            {user ? (
              <>
                <li className={styles.menuItem}>
                  <Link to={`/user/${user.id}`} className={styles.link}>
                    <div className={styles.mask}></div>
                    <span>{user.nickname}</span>
                  </Link>
                </li>
                <li className={styles.menuItem}>
                  <Link to="/message" className={styles.link}>
                    <div className={styles.mask}></div>
                    <span>消息</span>
                  </Link>
                </li>
                <li className={styles.menuItem}>
                  <Link to="/settings" className={styles.link}>
                    <div className={styles.mask}></div>
                    <span>设置</span>
                  </Link>
                </li>
                <li className={styles.menuItem}>
                  <a className={styles.link} onClick={logout}>
                    <div className={styles.mask}></div>
                    <span>退出</span>
                  </a>
                </li>
              </>
            ) : (
              <li className={styles.menuItem}>
                <Link to="/login" className={styles.link}>
                  <div className={styles.mask}></div>
                  <span>登录</span>
                </Link>
              </li>
            )}
          </ul>
          <ul className={styles.mobileMenu}>
            {user ? (
              <li className={styles.menuItem}>
                <a className={styles.link} onClick={logout}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-exit"></use>
                  </svg>
                </a>
              </li>
            ) : undefined}
          </ul>
        </div>
      </div>
      <div className={styles.banner}>
        <img
          src="https://ali.ringoer.com/cdn/caho/banner/bg_pic.jpg"
          alt="首页头图"
        />
      </div>
    </header>
  );
});

export default Topnav;
