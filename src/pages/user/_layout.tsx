import styles from './_layout.less';
import Loading from '@/components/Loading'
import { connect, history } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';

import Tab from './[id]'

const options = ['主页', '资料', '动态', '相册', '收藏', '留言板']

export default connect(({ breadcrumb }: { breadcrumb: Breadcrumb[] }) => ({ breadcrumb }))((props: any) => {
  const [option, setOption] = useState(options[0])
  const [user, setUser] = useState<User>()
  useEffect(() => {
    request(location.pathname)
      .then(result => {
        const { data }: { data: User } = result
        if (!data) {
          history.push('/404')
          return
        }
        console.log(data)
        setUser(data)
        props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: location.pathname, name: data.username }] })
      })
  }, [])
  return (
    <div className={styles.main}>
      {!user ? <Loading /> : (
        <>
          <div className={styles.topbar}>
            <div className={styles.banner}>
              <img src={require('@/assets/user_banner.jpg')} alt="用户头图" />
            </div>
            <div className={styles.userInfo}>
              <img src={user.avatarUrl} alt="用户头像" className={styles.avatar} />
              <p className={styles.nickname}>{user.nickname}</p>
              <p className={styles.signature}>
                {user.signature || '这个人很懒，什么也没写...'}
              </p>
            </div>
            <ul className={styles.options}>
              {options.map(item => (
                <li className={styles.option}>
                  <button className={styles.action + (item === option ? ` ${styles.active}` : '')} onClick={() => setOption(item)}>{item}</button>
                </li>
              ))}
            </ul>
          </div>
          <Tab tab={option} />
        </>
      )}
    </div>
  );
})