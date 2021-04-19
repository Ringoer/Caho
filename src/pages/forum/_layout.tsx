import styles from './_layout.less';
import Section from '@/components/Section'
import Loading from '@/components/Loading'
import { connect, Link } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';
import Note from '@/components/Note';

export default connect(({ user, login }: { user: User, login: string }) => ({ user, login }))((props: any) => {
  const { user, login } = props
  const [recommends, setRecommends] = useState<Topic[]>([])
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    if (!login) {
      return
    }
    if (login === 'unlogin') {
      setFlag(true)
      return
    }
    if (!user) {
      return
    }
    request('/topic/recommend')
      .then(res => {
        setFlag(true)
        if (res.errno === 0) {
          setRecommends(res.data)
        } else {
          console.error(res.errmsg)
        }
      })
  }, [user, login])
  return (
    <div className={styles.main}>
      {props.children}
      <div className={[styles.sidebar, location.pathname === '/forum' ? styles.index : ''].join(' ')}>
        {flag ? (
          <>
            <Section color="#FFCF4B" title="个人信息">
              {!user ? (
                <p>
                  还没登录？立即
                  <Link to='/login' className={styles.login}> 登录 </Link>
            ！
                </p>
              ) : (
                <div className={styles.user}>
                  <div className={styles.avatar}>
                    <Link to={`/user/${user.id}`}>
                      <img src={user.avatarUrl} alt="头像" />
                    </Link>
                  </div>
                  <div className={styles.info}>
                    <Link to={`/user/${user.id}`}>
                      <span>{user.nickname}</span>
                    </Link>
                    <br />
                    <span>积分：{user.score}</span>
                  </div>
                </div>)}
            </Section>
            <Section color="#FC83A3" title="推荐内容">
              <ul className={styles.recommends}>
                {recommends.length === 0 ?
                  <li>暂无推荐内容</li> :
                  recommends.map(recommend => (
                    <li className={styles.recommend} key={recommend.id}>
                      <Link to={`/forum/topic/${recommend.id}`}>
                        <Note>
                          {recommend.title}
                        </Note>
                      </Link>
                    </li>
                  ))}
              </ul>
            </Section>
          </>
        ) : (
          <>
            <Section color="#FFCF4B" title="个人信息">
              <Loading />
            </Section>
            <Section color="#FC83A3" title="推荐内容">
              <Loading />
            </Section>
          </>
        )}
      </div>
    </div>
  );
})