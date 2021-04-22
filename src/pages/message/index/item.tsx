import styles from './item.less'

import Note from '@/components/Note'
import marked from 'marked'
import { changeTime } from '@/util/time'

export default (props: any) => {
  const { message }: { message: Message } = props

  return (
    <Note>
      <div className={styles.messageWrapper}>
        <div className={styles.message}>
          <div className={styles.titleWrapper}>
            <span className={styles.title}>
              <span>{message.title}</span>
            </span>
            <span className={styles.time}>{changeTime(message.gmtCreate)}</span>
          </div>
          <article
            className='markdown-body'
            dangerouslySetInnerHTML={{ __html: marked(message.content) }}
          />
        </div>
      </div>
    </Note>
  )
}