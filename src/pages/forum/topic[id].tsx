import { useEffect, useState } from 'react';
import styles from './topic[id].less';
import request from '@/util/request'

import Floor from '@/components/Floor'
import Pagination from '@/components/Pagination'
import Loading from '@/components/Loading'
import Editor from '@/components/Editor'
import { connect, history } from 'umi';
import { changeTime } from '@/util/time';

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user, breadcrumb } = props
  const { id: topicId } = props.match.params
  const [topic, setTopic] = useState<Topic>()
  const [floors, setFloors] = useState<Reply[]>([])
  const [selectedPage, setPage] = useState((history.location.query && history.location.query.page) || 1)

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
        alert('回复主题成功！')
        location.reload()
      } else {
        alert(result.errmsg)
      }
    })
  }

  useEffect(() => {
    request(`/topic/${topicId}`)
      .then(result => {
        const { data } = result
        console.log(data)
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
                    { index: 1, pathname: `/forum/${forum.id}`, name: forum.forumName },
                    { index: 2, pathname: location.pathname, name: data.title }
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
        props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 2, pathname: location.pathname, name: data.title }] })
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
            floors.slice(10 * (+selectedPage - 1), 10 * +selectedPage).map((floor: any, index: number) => (
              <Floor topic={floor} key={floor.id} index={index + 10 * +selectedPage - 9} />
            ))
          }
          <Pagination selectedPage={selectedPage} maxPage={parseInt(((floors.length + 9) / 10).toString()) || -1} action={(target: string) => setPage(target)} />
          <br />
          <Editor
            disabled={
              user ? (
                topic.forumId === 1 ? true : false
              ) : true
            }
            description='发表新回复'
            onSubmit={onSubmit}
          />
        </>
      )}
    </div>
  );
})