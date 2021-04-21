import Loading from "@/components/Loading"
import Pagination from "@/components/Pagination"
import request from "@/util/request"
import { useEffect, useState } from "react"
import Item from "./item"

export default (props: any) => {
  const { tab } = props

  const [messages, setMessages] = useState<Message[]>()
  const [messagesCount, setMessagesCount] = useState(0)
  const [selectedPage, setPage] = useState(1)

  useEffect(() => {
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
  }, [selectedPage])

  return (
    messages ? (
      messages.length === 0 ? (
        <p>暂无更多</p>
      ) : (
        <>
          <ul>
            {messages.map(message => (
              <li key={message.id}>
                <Item message={message} />
              </li>
            ))}
          </ul>
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
}