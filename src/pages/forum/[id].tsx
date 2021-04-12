import { useEffect, useState } from 'react';
import styles from './[id].less';
import request from '@/util/request'
import { connect, history, Link } from 'umi'

import Button from '@/components/Button'
import Note from '@/components/Note'
import Pagination from '@/components/Pagination'
import Loading from '@/components/Loading'
import { changeTime } from '@/util/time';
import Editor from '@/components/Editor';

const parts = {
  'share': '分享',
  'ask': '问答',
  'job': '招聘',
  'good': '精华',
  'dev': '测试',
  'test': '测试',
}

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user } = props
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedPage, setPage] = useState((history.location.query && history.location.query.page) || 1)
  const [selectedTab, setTab] = useState((history.location.query && history.location.query.page) || 'all')
  const [forum, setForum] = useState<Forum>()
  const [collected, setCollected] = useState(false)

  function collectForum() {
    if (!forum) {
      return
    }
    request('/forum/collect', {
      method: 'post',
      body: JSON.stringify({
        id: forum.id,
        collect: !collected
      })
    }).then(result => {
      if (result.errno === 0) {
        location.reload()
      } else {
        alert(`操作失败！\n原因：${result.errmsg}`)
        console.error(result.errmsg)
      }
    })
  }

  function onSubmit(content: string, title: string) {
    if (!forum) {
      return
    }
    request('/topic', {
      method: 'post',
      body: JSON.stringify({
        forumId: forum.id,
        title,
        content: content.split('\n').join('\n\n')
      })
    }).then(result => {
      if (result.errno === 0) {
        alert('发表主题成功！')
        location.reload()
      } else {
        alert(result.errmsg)
      }
    })
  }

  useEffect(() => {
    request('/forum/collect')
      .then(result => {
        if (!forum) {
          return
        }
        const { data }: { data: Forum[] } = result
        const collectForum = data.find(item => item.id === forum.id)
        if (collectForum) {
          setCollected(true)
        }
      })
  }, [forum])

  useEffect(() => {
    setPage((history.location.query && history.location.query.page) || 1)
    setTab((history.location.query && history.location.query.tab) || 'all')
  }, [history.location.query])

  useEffect(() => {
    request(location.pathname)
      .then(result => {
        setForum(result.data)
        props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: location.pathname, name: `[版块] ${result.data.forumName}` }] })

        const target = parseInt(selectedPage.toString())
        if (!(typeof target === 'number' && target % 1 === 0 && target > 0)) {
          history.push('?page=1')
        }
        request(`/topic?forum=${result.data.id}&page=${selectedPage}&tab=${selectedTab}`)
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
  }, [selectedPage, selectedTab])
  return (
    <div className={styles.container}>
      {forum ? (
        <div className={styles.forumTop}>
          { forum.bannerUrl ? (
            <img src={forum.bannerUrl} alt="版块背景" className={styles.banner} />
          ) : undefined}
          <div className={styles.forumInfoWrapper}>
            <div className={styles.forumInfo}>
              <img className={styles.avatar} src={forum.avatarUrl || ''} alt="版块头像" />
              <span className={styles.forumName}>{forum.forumName || '版块名称'}</span>
              <span className={styles.description}>{forum.description || '版块描述'}</span>
              <div className={styles.collect}>
                <Button className={styles.collect} onClick={collectForum}>
                  {collected ? '取消关注' : '关注'}
                </Button>
              </div>
              <div className={styles.sign}>
                <Button className={styles.sign}>签到</Button>
              </div>
            </div>
          </div>
        </div>
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
                      (<span className={styles.isTop}>置顶</span>) :
                      undefined}
                    <button className={styles.part} onClick={() => {
                      setPage(1)
                      setTab(topic.tab)
                    }}>{parts[topic.tab] || '其它'}</button>
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
            <Pagination
              selectedPage={selectedPage}
              action={(target: string) => {
                history.push('?page=' + target)
              }}
            />
          </div>
          <br />
          <Editor
            disabled={
              user ? (
                forum.id === 1 ? true : false
              ) : true
            }
            description='发表新主题'
            hasTitle
            onSubmit={onSubmit}
          />
        </>
      )}
    </div>
  );
})