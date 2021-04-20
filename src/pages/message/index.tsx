import styles from './index.less';
import Loading from '@/components/Loading'
import { connect, history } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';
import Tabs from '@/components/Tabs';
import Tab from '@/components/Tab';
import Note from '@/components/Note';

const options = ['通知', '提及', '私信']
const tabHash = {
  '私信': 0,
  '通知': 1,
  '提及': 2,
}

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user } = props

  const [option, setOption] = useState(options[0])

  const [messagess, setMessagess] = useState<Message[][]>()
  const [notifications, setNotifications] = useState<Message[]>()
  const [metions, setMetions] = useState<Message[]>()
  const [messages, setMessages] = useState<Message[]>()

  const [_, fresh] = useState(0)
  const [clientWidth, setClientWidth] = useState(document.body.clientWidth)

  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: location.pathname, name: '[功能] 消息' }] })
    request(`/message/tab?page=1&tab=0`)
      .then(result => {
        if (result.errno !== 0) {
          setMessages([])
          return
        }
        const { data } = result
        setMessages(data || [])
      })
    request(`/message/tab?page=1&tab=1`)
      .then(result => {
        if (result.errno !== 0) {
          setNotifications([])
          return
        }
        const { data } = result
        setNotifications(data || [])
      })
    request(`/message/tab?page=1&tab=2`)
      .then(result => {
        if (result.errno !== 0) {
          setMetions([])
          return
        }
        const { data } = result
        setMetions(data || [])
      })
  }, [])

  useEffect(() => {
    if (!notifications || !metions || !messages) {
      return
    }
    setMessagess([messages, notifications, metions])
  }, [notifications, metions, messages])

  useEffect(() => {
    fresh(Math.random())
  }, [clientWidth])

  window.onresize = () => {
    setClientWidth(document.body.clientWidth)
  }

  return (
    <div className={styles.container}>
      {messagess ? (
        <Tabs
          key={_}
          itemWidth='33%'
          itemHeight='32px'
        >
          {options.map(tab => (
            <Tab key={tab} title={tab} name={tab}>
              <ul>
                {messagess[tabHash[tab]].length === 0 ? (
                  <li><Note>暂无更多</Note></li>
                ) : (
                  messagess[tabHash[tab]].map(message => (
                    <li key={message.id}>
                      <Note>
                        <p style={{ margin: 0 }}>&nbsp;{message.content}</p>
                      </Note>
                    </li>
                  ))
                )}
              </ul>
            </Tab>
          ))}
        </Tabs>
      ) : <Loading />}
    </div>
  )
})