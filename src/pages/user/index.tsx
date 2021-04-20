import { useEffect, useState } from 'react';
import styles from './index.less';
import request from '@/util/request'
import { connect, Link } from 'umi'
import Section from '@/components/Section';
import Loading from '@/components/Loading';
import Note from '@/components/Note';

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user, userId } = props
  const [forums, setForums] = useState<Forum[]>()
  const [topics, setTopics] = useState<Topic[]>()
  const [replyTo, setReplyTo] = useState<Topic[]>()

  const [_, fresh] = useState(0)

  useEffect(() => {
    if (userId === '0' || !Number.isInteger(+userId)) {
      setForums([])
      setTopics([])
      setReplyTo([])
    }
    request(`/forum/collect?userId=${userId}`)
      .then(result => {
        if (result.errno !== 0) {
          setForums([])
          return
        }
        const { data } = result
        if (!data) {
          setForums([])
        } else {
          setForums(data)
        }
      })
    request(`/topic/latest?userId=${userId}`)
      .then(result => {
        if (result.errno !== 0) {
          setTopics([])
          return
        }
        const { data } = result
        if (!data) {
          setTopics([])
        } else {
          setTopics(data)
        }
      })
    request(`/topic/reply/latest?userId=${userId}`)
      .then(result => {
        if (result.errno !== 0) {
          setReplyTo([])
          return
        }
        const { data } = result
        if (!data) {
          setReplyTo([])
        } else {
          setReplyTo(data)
        }
      })
  }, [])
  return (
    <div className={styles.profile}>
      {forums && topics && replyTo ? (
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
                        <span className={styles.level}>{parseInt(((forum.exp || 0) / 100 + 1).toString())}&nbsp;级</span>
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
                  {topics.map(topic => (
                    <li key={topic.id}>
                      <Link to={`/forum/topic/${topic.id}`}>
                        <Note>
                          {topic.title}
                        </Note>
                      </Link>
                    </li>
                  ))}
                </ul>
              }
            </Section>
            <Section color="#FC83A3" title="最近回复的帖子">
              {replyTo.length === 0 ? '暂无更多' :
                <ul>
                  {replyTo.map(topic => (
                    <li key={topic.id}>
                      <Link to={`/forum/topic/${topic.id}`}>
                        <Note>
                          {topic.title}
                        </Note>
                      </Link>
                    </li>
                  ))}
                </ul>
              }
            </Section>
          </div>
        </div>
      ) : <Loading />}
    </div>
  )
})