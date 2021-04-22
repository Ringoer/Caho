import styles from './item.less'

import Note from '@/components/Note'
import marked from 'marked'
import { useState } from 'react'
import Button from '@/components/Button'
import { changeTime } from '@/util/time'
import { Link } from 'react-router-dom'

export default (props: any) => {
  const { message, hasAuthor }: { message: Message, hasAuthor: boolean } = props

  const [hide, setHide] = useState(true)

  return (
    <Note>
      <div className={styles.messageWrapper}>
        <div className={styles.message}>
          <div className={styles.titleWrapper}>
            <span className={styles.title}>
              {hasAuthor ? (
                <Link to={`/user/${message.fromId}`}>{`${message.fromNickname}(${message.fromUsername}) `}</Link>
              ) : undefined}
              <span>{message.title}</span>
            </span>
            <span className={styles.time}>{changeTime(message.gmtCreate)}</span>
          </div>
          <article
            className={['markdown-body', styles.content, hide ? styles.hide : undefined].join(' ')}
            dangerouslySetInnerHTML={{ __html: marked(message.content) }}
          />
        </div>
        <div className={styles.action}>
          <Button
            color='black'
            backgroundColor='white'
            onClick={() => setHide(!hide)}>
            {hide ? '展开' : '收起'}
          </Button>
        </div>
      </div>
    </Note>
  )
}