import styles from './privateItem.less'

import Note from '@/components/Note'
import Button from '@/components/Button'
import { changeTime } from '@/util/time'
import { Link, history } from 'umi'
import request from '@/util/request'

export default (props: any) => {
  const { message }: { message: Message } = props

  function readMessage(id: number) {
    request('/message/read', {
      method: 'put',
      body: JSON.stringify([id])
    })
  }

  return (
    <Note>
      <div className={styles.messageWrapper}>
        <div className={styles.message}>
          <div className={styles.titleWrapper}>
            <p className={styles.info}>
              <Link to={`/user/${message.fromId}`}>
                <span className={styles.sender}>{`${message.fromNickname}(${message.fromUsername}) `}</span>
              </Link>
              <span className={styles.time}>{changeTime(message.gmtCreate)}</span>
            </p>
            <span className={styles.title}>{message.title}</span>
          </div>
        </div>
        <div className={styles.action}>
          <Button
            color='black'
            backgroundColor='white'
            onClick={() => {
              readMessage(message.id)
              history.push('/message/view', message)
            }}
          >
            查看
          </Button>
        </div>
      </div>
    </Note>
  )
}