import { useEffect, useState } from 'react';
import styles from './[id].less';
import request from '@/util/request'
import { connect, history, Link } from 'umi'
import Loading from '@/components/Loading';
import Section from '@/components/Section';

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user, tab } = props
  const [forums, setForums] = useState<Forum[]>([])
  const [profile, setProfile] = useState('')
  useEffect(() => {
    if (!user) {
      return
    }
    if (tab === '主页') {
      request(`/forum`).then(result => {
        const { data } = result
        if (!data) {
          return
        }
        setForums(data)
      })
    } else if (tab === '资料') {
      request(`/user/${user.id}/profile`).then(result => {
        const { data } = result
        if (!data) {
          return
        }
        setProfile(data.profile)
      })
    }
  }, [tab])
  return (
    !user ? <Loading /> :
      <div className={styles.container}>
        {tab === '主页' ? (
          <div className={styles.home}>
            <div className={styles.first}>
              <Section title="关注版块">
                <ul className={styles.forums}>
                  {forums.map(forum => (
                    <li className={styles.forum}>
                      <Link to={`/forum/${forum.id}`}>
                        18&nbsp;&nbsp;{forum.forumName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
            <div className={styles.second}>
              <Section color="#FFCF4B" title="最近发帖">
                暂无更多
              </Section>
              <Section color="#FC83A3" title="最近回复">
                暂无更多
              </Section>
            </div>
          </div>
        ) : undefined}
        {tab === '资料' ? (
          <div className={styles.profile}>
            <div className={styles.first}>
              <Section title="个人介绍">
                <article dangerouslySetInnerHTML={{ __html: profile }} />
              </Section>
            </div>
            <div className={styles.second}>
              <Section color="#FFCF4B" title="个人资料">
                暂无更多
              </Section>
              <Section color="#FC83A3" title="社交媒体">
                暂无更多
              </Section>
            </div>
          </div>
        ) : undefined}
        {tab === '动态' ? (
          <div className={styles.dynamics}>
            <p>这里是{tab}功能的子页面，敬请期待！</p>
          </div>
        ) : undefined}
        {tab === '相册' ? (
          <div className={styles.album}>
            <p>这里是{tab}功能的子页面，敬请期待！</p>
          </div>
        ) : undefined}
        {tab === '收藏' ? (
          <div className={styles.colloect}>
            <p>这里是{tab}功能的子页面，敬请期待！</p>
          </div>
        ) : undefined}
        {tab === '留言板' ? (
          <div className={styles.board}>
            <p>这里是{tab}功能的子页面，敬请期待！</p>
          </div>
        ) : undefined}
      </div>
  );
})