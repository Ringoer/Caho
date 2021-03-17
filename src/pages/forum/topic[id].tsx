import { useEffect, useState } from 'react';
import styles from './topic[id].less';
import request from '@/util/request'

import Floor from '@/components/Floor'
import Pagination from '@/components/Pagination'
import Loading from '@/components/Loading'
import { connect, history } from 'umi';
import { changeTime } from '@/util/time';

const baseTopic: any = {
  author: {
    avatar_url: '',
    loginname: ''
  },
  title: '标题',
  replies: [],
}

const baseArray: any[] = []

const getForum1 = new Promise(resolve => {
  resolve({
    json: () => ({
      data: { id: 0, src: 'http://pic.ringoer.com/64928049_p0.png', name: 'CNODE社区', href: '/forum/0' }
    })
  })
})

export default connect(({ breadcrumb }: { breadcrumb: Breadcrumb[] }) => ({ breadcrumb }))((props: any) => {
  const { breadcrumb } = props
  const { id: topicId } = props.match.params
  const [topic, setTopic] = useState(baseTopic)
  const [floors, setFloors] = useState(baseArray)
  const [selectedPage, setPage] = useState((history.location.query && history.location.query.page) || 1)
  useEffect(() => {
    if (breadcrumb.length < 2) {
      getForum1
        .then((res: any) => res.json())
        .then(result => {
          props.dispatch(
            {
              type: 'breadcrumb/info',
              payload: [
                { index: 1, pathname: result.data.href, name: result.data.name },
              ]
            })
        })
    }
    request('/topic/' + topicId)
      .then(result => {
        const { data } = result
        console.log(data)
        if (data && data.content) {
          data.create_at = changeTime(data.create_at)
          data.replies = data.replies.map((item: any) => {
            item.create_at = changeTime(item.create_at)
            return item
          })
          setTopic(data)
          setFloors([data].concat(data.replies))
          props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 2, pathname: location.pathname, name: data.title }] })
        } else {
          history.push('/404')
        }
      })
  }, [])
  return (
    <div className={styles.container}>
      {topic === baseTopic ? <Loading /> : (
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
        </>
      )}
    </div>
  );
})