import Loading from "@/components/Loading"
import Pagination from "@/components/Pagination"
import request from "@/util/request"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import Item from "./item"
import PrivateItem from './privateItem'

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { tab, user } = props
  const Message = [0, 3].includes(tab) ? PrivateItem : Item

  const [messages, setMessages] = useState<Message[]>()
  const [messagesCount, setMessagesCount] = useState(0)
  const [selectedPage, setPage] = useState(1)

  useEffect(() => {
    if (!messages || [0, 3].includes(tab)) {
      return
    }
    request('/message/read', {
      method: 'put',
      body: JSON.stringify(messages.map(m => m.id))
    })
  }, [messages])

  useEffect(() => {
    if (tab === 3) {
      if (!user) {
        return
      }
      request(`/message/fromid?fromid=${user.id}&page=${selectedPage}`)
        .then(result => {
          const { data } = result
          if (result.errno !== 0 || !data) {
            setMessages([])
            return
          }
          const { messages, messagesCount } = data
          setMessages(messages)
          setMessagesCount(messagesCount)
        })
    } else {
      request(`/message/tab?tab=${tab}&page=${selectedPage}`)
        .then(result => {
          const { data } = result
          if (result.errno !== 0 || !data) {
            setMessages([])
            return
          }
          const { messages, messagesCount } = data
          setMessages(messages)
          setMessagesCount(messagesCount)
        })
    }
  }, [user, selectedPage])

  return (
    messages ? (
      messages.length === 0 ? (
        <p>暂无更多</p>
      ) : (
        <>
          {tab === 3 ? (
            <p style={{ margin: '8px' }}>如果需要发送私信，请前往目标用户的主页</p>
          ) : undefined}
          <ul>
            {messages.map(message => (
              <li key={message.id} style={{ backgroundColor: message.beRead ? 'white' : '#eefbff' }}>
                <Message message={message} />
              </li>
            ))}
          </ul>
          <br />
          <Pagination
            selectedPage={selectedPage}
            count={messagesCount}
            action={(target: string) => setPage(+target)}
          />
        </>
      )
    ) : (
      <Loading />
    )
  )
})