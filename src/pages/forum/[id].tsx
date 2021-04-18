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
import { Swal } from '@/util/swal';

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
  const [topicsCount, setTopicsCount] = useState(0)
  const [selectedPage, setPage] = useState((history.location.query && history.location.query.page) || 1)
  const [forum, setForum] = useState<Forum>()
  const [collected, setCollected] = useState<boolean>()
  const [sign, setSign] = useState(true)

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
        Swal.error(`操作失败，请先登录！`)
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
        Swal.success('发表主题成功！')
          .then(() => {
            location.reload()
          })
      }
    })
  }

  function onSign() {
    if (!forum || !user) {
      return
    }
    if (!collected) {
      Swal.info('请先关注本版块')
      return
    }
    request('/forum/sign', {
      method: 'post',
      body: JSON.stringify({
        id: forum.id,
      })
    }).then(result => {
      if (result.errno === 0) {
        Swal.success('签到成功！')
        setSign(true)
      }
    })
  }

  useEffect(() => {
    if (!user) {
      return
    }
    request(`/forum/collect?userid=${user.id}`)
      .then(result => {
        if (!forum) {
          return
        }
        const { data }: { data: Forum[] } = result
        if (!data) {
          return
        }
        const collectForum = data.find(item => item.id === forum.id)
        if (collectForum) {
          setCollected(true)
        } else {
          setCollected(false)
        }
      })
  }, [user, forum])

  useEffect(() => {
    setPage((history.location.query && history.location.query.page) || 1)
  }, [history.location.query])

  useEffect(() => {
    request(location.pathname)
      .then(result => {
        if (result.errno !== 0) {
          history.push('/404')
          return
        }
        setForum(result.data)
        props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: location.pathname, name: `[版块] ${result.data.forumName}` }] })

        const target = parseInt(selectedPage.toString())
        if (!(typeof target === 'number' && target % 1 === 0 && target > 0)) {
          history.push('?page=1')
        }
        request(`/topic?forumId=${result.data.id}&page=${selectedPage}`)
          .then(result => {
            const { data } = result
            if (!data) {
              history.push('/404')
              return
            }
            const { topics, topicsCount } = data
            if (!topics || topics.length === 0) {
              history.push('/404')
              return
            }
            topics.forEach((topic: Topic) => {
              topic.lastReplyAt = changeTime(topic.lastReplyAt)
            })
            setTopics(topics)
            setTopicsCount(+topicsCount)
          })
      })
  }, [selectedPage])

  useEffect(() => {
    if (!user || !forum) {
      return
    }
    request(`/forum/sign?id=${forum.id}`)
      .then(result => {
        if (result.errno === 0) {
          setSign(result.data)
        }
      })
  }, [user, forum])

  return (
    <div className={styles.container}>
      {forum ? (
        <div className={styles.forumTop}>
          { forum.bannerUrl ? (
            <img src={forum.bannerUrl} alt="版块背景" className={styles.banner} />
          ) : undefined}
          <div className={styles.forumInfoWrapper}>
            <div className={styles.forumInfo}>
              <img
                className={styles.avatar}
                src={forum.avatarUrl || ''}
                alt="版块头像"
                onClick={() => {
                  setPage(1)
                }}
              />
              <span className={styles.forumName}>{forum.forumName || '版块名称'}</span>
              <span className={styles.description}>{forum.description || '版块描述'}</span>
              <div className={styles.collect}>
                {collected === undefined ? (
                  <Button className={styles.collect}>
                    加载中
                  </Button>
                ) : (
                  <Button className={styles.collect} onClick={collectForum}>
                    {collected ? '取消关注' : '关注'}
                  </Button>
                )}
              </div>
              <div className={styles.sign}>
                {sign ?
                  <Button
                    backgroundColor='white'
                    color='black'
                    className={styles.sign}>已签到</Button>
                  :
                  <Button className={styles.sign} onClick={onSign}>签到</Button>
                }
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
                    <div className={styles.tags}>
                      {topic.top ?
                        (<span className={styles.isTop}>置顶</span>) :
                        undefined}
                      <span className={styles.part}>{parts[topic.tab] || '其它'}</span>
                    </div>
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
              maxPage={topicsCount > 1 ? (topicsCount + 9) / 10 : undefined}
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