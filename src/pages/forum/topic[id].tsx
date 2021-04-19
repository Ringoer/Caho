import { useEffect, useState } from 'react';
import styles from './topic[id].less';
import request from '@/util/request'

import Floor from '@/components/Floor'
import Pagination from '@/components/Pagination'
import Loading from '@/components/Loading'
import Editor from '@/components/Editor'
import { connect, history } from 'umi';
import { changeTime } from '@/util/time';
import { Swal } from '@/util/swal';

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user, breadcrumb } = props
  const { id: topicId } = props.match.params
  const [topic, setTopic] = useState<Topic>()
  const [floors, setFloors] = useState<Reply[]>([])
  const [selectedPage, setPage] = useState((history.location.query && history.location.query.page) || 1)
  const [defaultValue, setDefaultValue] = useState('')

  function onReply(userId: number, userNickname: string) {
    setDefaultValue(`[@${userNickname}](/user/${userId}) `)
    scrollTo(0, 99999)
  }

  function onReport(replyId: number) {
    Swal.confirm('您真的要举报这个楼层吗')
      .then(res => {
        if (!res) {
          return
        }
        request('/topic/report', {
          method: 'post',
          body: JSON.stringify({
            replyId
          })
        }).then(res => {
          if (res.errno === 0) {
            Swal.success('举报成功')
              .then(() => {
                location.reload()
              })
          } else {
            Swal.error('举报失败')
            console.error(res.errmsg)
          }
        })
      })
  }

  function onCheckOwner(flag: boolean) {
    if (!topic || !(topic.replies instanceof Array)) {
      return
    }
    const data: any[] = []
    data.push(topic)
    data.push(...topic.replies)
    if (flag) {
      setFloors(data.filter(floor => floor.userId === topic.userId))
    } else {
      setFloors(data)
    }
  }

  function onSubmit(content: string) {
    if (!topic) {
      return
    }
    request('/topic/reply', {
      method: 'post',
      body: JSON.stringify({
        topicId: topic.id,
        content: content.split('\n').join('\n\n')
      })
    }).then(result => {
      if (result.errno === 0) {
        Swal.success('回复主题成功！')
          .then(() => {
            location.reload()
          })
      } else {
        Swal.error(result.errmsg)
      }
    })
  }

  useEffect(() => {
    request(`/topic/${topicId}`)
      .then(result => {
        const { data } = result
        if (!data) {
          history.push('/404')
          return
        }
        if (breadcrumb.length < 2) {
          request(`/forum/${data.forumId}`)
            .then(result => {
              const { data: forum }: { data: Forum } = result
              if (!forum) {
                history.push('/404')
                return
              }
              props.dispatch(
                {
                  type: 'breadcrumb/info',
                  payload: [
                    { index: 1, pathname: `/forum/${forum.id}`, name: `[版块] ${forum.forumName}` },
                    { index: 2, pathname: location.pathname, name: `[主题] ${data.title}` }
                  ]
                })
            })
        }
        data.gmtCreate = changeTime(data.gmtCreate)
        data.replies = (data.replies || []).map((reply: Reply) => {
          reply.gmtCreate = changeTime(reply.gmtCreate)
          return reply
        })
        setTopic(data)
        setFloors([data].concat(data.replies))
        props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 2, pathname: location.pathname, name: `[主题] ${data.title}` }] })
      })
  }, [])
  return (
    <div className={styles.container}>
      {!topic ? <Loading /> : (
        <>
          <h1 className={styles.title}>
            {topic.title}
          </h1>
          <hr className={styles.separator} />
          {
            floors.slice(10 * (+selectedPage - 1), 10 * +selectedPage).map((floor: Reply, index: number) => (
              <Floor
                reply={floor}
                key={floor.id}
                index={index + 10 * +selectedPage - 9}
                onReply={onReply}
                onReport={onReport}
                onCheckOwner={onCheckOwner}
                ownerId={floors[0].userId}
              />
            ))
          }
          <Pagination selectedPage={selectedPage} count={floors.length} action={(target: string) => setPage(target)} />
          <br />
          <Editor
            disabled={
              user ? (
                topic.forumId === 1 ? true : false
              ) : true
            }
            key={defaultValue}
            defaultValue={defaultValue}
            description='发表新回复'
            onSubmit={onSubmit}
          />
        </>
      )}
    </div>
  );
})