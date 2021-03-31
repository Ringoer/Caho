import { useEffect, useState } from 'react';
import styles from './[id].less';
import request from '@/util/request'
import { connect, history, Link } from 'umi'

import Note from '@/components/Note'
import Pagination from '@/components/Pagination'
import Loading from '@/components/Loading'
import { changeTime } from '@/util/time';

const parts = {
  'share': '分享',
  'ask': '问答',
  'job': '招聘',
  'good': '精华',
  'dev': '测试',
}

export default connect(({ breadcrumb }: { breadcrumb: Breadcrumb[] }) => ({ breadcrumb }))((props: any) => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedPage, setPage] = useState((history.location.query && history.location.query.page) || 1)
  const [forum, setForum] = useState({ avatarUrl: '', forumName: '', bannerUrl: '' })
  useEffect(() => {
    setPage((history.location.query && history.location.query.page) || 1)
  }, [history.location.query])
  useEffect(() => {
    // fetch('/api/forum/' + id)
    request(location.pathname)
      .then(result => {
        setForum(result.data)
        props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: location.pathname, name: result.data.forumName }] })

        const target = parseInt(selectedPage.toString())
        if (!(typeof target === 'number' && target % 1 === 0 && target > 0)) {
          history.push('?page=1')
        }
        request('/topic?forum=' + result.data.id + '&page=' + selectedPage)
          .then(result => {
            const { data } = result
            if (!data || data.length === 0) {
              history.push('/404')
              return
            }
            data.forEach((topic: Topic) => {
              topic.lastReplyAt = changeTime(topic.lastReplyAt)
            })
            console.log(data)
            setTopics(data)
          })
      })
  }, [selectedPage])
  return (
    <div className={styles.container}>
      {forum.bannerUrl ? (
        <img src={forum.bannerUrl} alt="版块背景" className={styles.banner} />
      ) : undefined}
      {!forum || topics.length === 0 ? <Loading /> : (
        <>
          <div className={styles.topics}>
            {topics.map((topic: Topic) => (
              <Note key={topic.id}>
                <div className={styles.topic}>
                  <Link to={'/user/' + topic.userId} className={styles.img}>
                    <img src={topic.userAvatarUrl} alt="楼主头像" />
                  </Link>
                  <div className={styles.title}>
                    {topic.top ?
                      (<button className={styles.isTop}>置顶</button>) :
                      undefined}
                    <button className={styles.part}>{parts[topic.tab] || '其它'}</button>
                    <Link to={'/forum/topic/' + topic.id} className={styles.link} >
                      {topic.title}
                    </Link>
                  </div>
                  <div className={styles.content} dangerouslySetInnerHTML={{ __html: topic.content }} />
                  <div className={styles.date}>
                    <Link to={'/user/' + topic.userId}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-person"></use>
                      </svg>
                      {topic.userNickname}
                    </Link>
                    <span>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-date"></use>
                      </svg>
                  回复于{topic.lastReplyAt}
                    </span>
                  </div>
                  <div className={styles.comment}>
                    <span>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-comment"></use>
                      </svg>
                      {topic.replyCount}
                    </span>
                    <span>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-view"></use>
                      </svg>
                      {topic.visitCount}
                    </span>
                  </div>
                </div>
              </Note>
            ))}
          </div>
          <div className={styles.pagination}>
            <Pagination selectedPage={selectedPage} action={(target: string) => history.push(history.location.pathname + '?page=' + target)} />
          </div>
        </>
      )}
    </div>
  );
})