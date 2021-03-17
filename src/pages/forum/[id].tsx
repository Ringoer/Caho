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

const getForum1 = new Promise(resolve => {
  resolve({
    json: () => ({
      data: {
        id: 0,
        src: 'http://pic.ringoer.com/64928049_p0.png',
        name: 'CNODE社区',
        href: '/forum/0',
        banner: 'cnode_banner.png'
      }
    })
  })
})

export default connect(({ breadcrumb }: { breadcrumb: Breadcrumb[] }) => ({ breadcrumb }))((props: any) => {
  const [content, setContent] = useState([])
  const [selectedPage, setPage] = useState((history.location.query && history.location.query.page) || 1)
  const [forum, setForum] = useState({ src: '', name: '', banner: '' })
  useEffect(() => {
    setPage((history.location.query && history.location.query.page) || 1)
  }, [history.location.query])
  useEffect(() => {
    // fetch('/api/forum/' + id)
    getForum1
      .then((res: any) => res.json())
      .then(result => {
        setForum(result.data)
        props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: result.data.href, name: result.data.name }] })
        const target = parseInt(selectedPage.toString())
        if (!(typeof target === 'number' && target % 1 === 0 && target > 0)) {
          history.push('?page=1')
        }
        request('/topic?forum=' + result.data.id + '&limit=10&page=' + selectedPage)
          .then(result => {
            const { data } = result
            if (!data || data.length === 0) {
              history.push('/404')
            }
            data.map((topic: any) => {
              topic.last_reply_at = changeTime(topic.last_reply_at)
              return topic
            })
            console.log(data)
            setContent(data)
          })
      })
  }, [selectedPage])
  return (
    <div className={styles.container}>
      {forum.banner ? (
        <img src={require('@/assets/' + forum.banner)} alt="版块背景" className={styles.banner} />
      ) : undefined}
      {!forum || content.length === 0 ? <Loading /> : (
        <>
          <div className={styles.topics}>
            {content.map((topic: any) => (
              <Note key={topic.id}>
                <div className={styles.topic}>
                  <Link to={'/user/' + topic.author.loginname} className={styles.img}>
                    <img src={topic.author.avatar_url} alt="楼主头像" />
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
                    <Link to={'/user/' + topic.author.loginname}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-person"></use>
                      </svg>
                      {topic.author.loginname}
                    </Link>
                    <span>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-date"></use>
                      </svg>
                  回复于{topic.last_reply_at}
                    </span>
                  </div>
                  <div className={styles.comment}>
                    <span>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-comment"></use>
                      </svg>
                      {topic.reply_count}
                    </span>
                    <span>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-view"></use>
                      </svg>
                      {topic.visit_count}
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