import styles from './_layout.less';
import Loading from '@/components/Loading'
import { connect, history } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';

import Index from './index';
import Profile from './profile';
import Follow from './follow';
import Album from './album';
import Button from '@/components/Button';
import { Swal } from '@/util/swal';

// const options = ['主页', '资料', '关注', '动态', '相册', '留言板']
const options = ['主页', '资料', '关注', '相册',]

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user } = props

  const [option, setOption] = useState(options[0])
  const [currentUser, setUser] = useState<User>()
  const [userId, setUserId] = useState<string>()

  function follow() {
    if (!userId) {
      return
    }
    Swal.confirm('您真的要关注该用户吗')
      .then((res) => {
        if (!res) {
          return
        }
        request('/user/follow', {
          method: 'post',
          body: JSON.stringify({
            followId: userId
          })
        }).then(res => {
          if (res.errno === 0) {
            Swal.success('关注成功！')
          } else {
            Swal.error(`关注失败！\n原因：${res.errmsg}`)
          }
        })
      })
  }

  useEffect(() => {
    const { id: userId } = props.match.params
    if (userId === '0') {
      history.push('/404')
      return
    }
    if (!Number.isInteger(+userId) && +userId > 0) {
      return
    }
    setUserId(userId)
    request(location.pathname)
      .then(result => {
        const { data }: { data: User } = result
        if (!data) {
          history.push('/404')
          return
        }
        setUser(data)
        props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: location.pathname, name: `[用户] ${data.username}` }] })
      })
  }, [])
  return (
    <div className={styles.main}>
      {!currentUser ? <Loading /> : (
        <>
          <div className={styles.topbar}>
            <div className={styles.banner}>
              <img src='https://ali.ringoer.com/cdn/caho/banner/user_banner.jpg' alt="用户头图" />
            </div>
            <div className={styles.userInfo}>
              <img src={currentUser.avatarUrl} alt="用户头像" className={styles.avatar} />
              <span className={styles.nickname}>{currentUser.nickname}</span>
              <span className={styles.signature}>
                {currentUser.signature || '这个人很懒，什么也没写...'}
              </span>
              <div className={styles.actionWrapper}>
                {user && user.id === currentUser.id ? (
                  <div className={styles.action}>
                    <Button onClick={() => history.push('/settings')}>
                      设置
                </Button>
                  </div>
                ) : (
                  <>
                    <div className={styles.action}>
                      <Button onClick={follow}>
                        关注
                </Button>
                    </div>
                    <div className={styles.action}>
                      <Button onClick={() => history.push('/message/add', currentUser)}>
                        私信
                </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <ul className={styles.options}>
              {options.map(item => (
                <li className={styles.option} key={item}>
                  <button className={[styles.tab, (item === option ? styles.active : '')].join(' ')} onClick={() => setOption(item)}>{item}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.content}>
            {userId ? (
              <>
                {option === '主页' ? (
                  <Index userId={location.pathname.substring('/user/'.length)} />
                ) : undefined}
                {option === '资料' ? (
                  <Profile userId={location.pathname.substring('/user/'.length)} />
                ) : undefined}
                {option === '关注' ? (
                  <Follow userId={location.pathname.substring('/user/'.length)} />
                ) : undefined}
                {option === '动态' ? (
                  <div className={styles.dynamics}>
                    <p>这里是{option}功能的子页面，敬请期待！</p>
                  </div>
                ) : undefined}
                {option === '相册' ? (
                  <>
                    {user && user.id === +userId ? (
                      <p style={{ display: 'flex', justifyContent: 'center' }}>
                        您可以上传最大10M的图片，上传速度大概为1M/5s，请耐心等待
                      </p>
                    ) : undefined}
                    <Album userId={location.pathname.substring('/user/'.length)} />
                  </>
                ) : undefined}
                {option === '留言板' ? (
                  <div className={styles.board}>
                    <p>这里是{option}功能的子页面，敬请期待！</p>
                  </div>
                ) : undefined}
              </>
            ) : undefined}
          </div>
        </>
      )}
    </div>
  );
})