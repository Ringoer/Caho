import styles from './_layout.less';
import Section from '@/components/Section'
import Loading from '@/components/Loading'
import { connect, Link } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user } = props
  const [recommends, setRecommends] = useState<Topic[]>([])
  useEffect(() => {
    if (!user) {
      return
    }
    request('/topic/recommend')
      .then(res => {
        if (res.errno === 0) {
          setRecommends(res.data)
        } else {
          console.error(res.errmsg)
        }
      })
  }, [user])
  return (
    <div className={styles.main}>
      {props.children}
      <div className={styles.sidebar}>
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
                <span>积分：0</span>
              </div>
            </div>)}
        </Section>
        <Section color="#FC83A3" title="推荐内容">
          <ul className={styles.recommends}>
            {recommends.length === 0 ?
              <li>暂无推荐内容</li> :
              recommends.map(recommend => (
                <li className={styles.recommend} key={recommend.id}>
                  <Link to={`/forum/topic/${recommend.id}`}>{recommend.title}</Link>
                </li>
              ))}
          </ul>
        </Section>
      </div>
    </div>
  );
})