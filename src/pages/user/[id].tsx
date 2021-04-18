import { useEffect, useState } from 'react';
import styles from './[id].less';
import request from '@/util/request'
import { connect, Link, history } from 'umi'
import Section from '@/components/Section';

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user, tab } = props
  const [forums, setForums] = useState<Forum[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [replyTo, setReplyTo] = useState<Topic[]>([])
  const [profile, setProfile] = useState('暂无更多')
  useEffect(() => {
    const userId = location.pathname.substring('/user/'.length)
    if (userId === '0') {
      history.push('/404')
      return
    }
    if (!Number.isInteger(+userId)) {
      return
    }
    if (tab === '主页') {
      request(`/forum/collect?userid=${userId}`)
        .then(result => {
          const { data } = result
          if (!data) {
            return
          }
          setForums(data)
        })
      request(`/topic/latest?userid=${userId}`)
        .then(result => {
          const { data } = result
          if (!data) {
            return
          }
          setTopics(data)
        })
      request(`/topic/reply/latest?userid=${userId}`)
        .then(result => {
          const { data } = result
          if (!data) {
            return
          }
          setReplyTo(data)
        })
    } else if (tab === '资料') {
      request(`${location.pathname}/profile`).then(result => {
        const { data } = result
        if (!data || !data.profile) {
          return
        }
        setProfile(data.profile)
      })
    }
  }, [tab])
  return (
    <div className={styles.container}>
      {tab === '主页' ? (
        <div className={styles.home}>
          <div className={styles.first}>
            <Section title="关注版块">
              <ul className={styles.forums}>
                {forums.length === 0 ?
                  <li>暂无关注版块</li> :
                  forums.map(forum => (
                    <li className={styles.forum} key={forum.id}>
                      <Link to={`/forum/${forum.id}`}>
                        <span>{forum.forumName}&nbsp;&nbsp;</span>
                        <span className={styles.exp}>{forum.exp || 0}&nbsp;经验&nbsp;&nbsp;</span>
                        <span className={styles.level}>{((forum.exp || 0) / 100 + 1).toFixed()}&nbsp;级</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </Section>
          </div>
          <div className={styles.second}>
            <Section color="#FFCF4B" title="最近发表的帖子">
              {topics.length === 0 ? '暂无更多' :
                <ul>
                  {topics.map(topic => <li key={topic.id} className={styles.sectionList}>
                    <Link to={`/forum/topic/${topic.id}`}>{topic.title}</Link>
                  </li>)}
                </ul>
              }
            </Section>
            <Section color="#FC83A3" title="最近回复的帖子">
              {replyTo.length === 0 ? '暂无更多' :
                <ul>
                  {replyTo.map(topic => <li key={topic.id} className={styles.sectionList}>
                    <Link to={`/forum/topic/${topic.id}`}>{topic.title}</Link>
                  </li>)}
                </ul>
              }
            </Section>
          </div>
        </div>
      ) : undefined}
      {tab === '资料' ? (
        <div className={styles.profile}>
          <div className={styles.first}>
            <Section title="个人介绍">
              <article
                dangerouslySetInnerHTML={{ __html: profile }}
                style={{ padding: '8px' }}
              />
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