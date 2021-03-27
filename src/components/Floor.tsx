import { useState } from 'react'
import styles from './Floor.less'
import Bubble from './Bubble'
import { Link } from 'umi'

export default (props: any) => {
  const { topic, index }: { topic: Topic, index: number } = props
  const [hide, setHide] = useState(false)
  return (
    <div className={styles.floor}>
      <div className={styles.author}>
        <Link to={'/user/' + topic.userId} className={styles.img}>
          <img src={topic.userAvatarUrl} alt="头像" />
        </Link>
        <div className={styles.authorInfo}>
          <Link to={'/user/' + topic.userId}>
            {topic.userNickname}
          </Link>
          <span className={styles.mobileFloorInfo}>{`第${index}楼 ` + topic.gmtCreate}</span>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.shrink}
            onClick={() => setHide(!hide)}>{hide ? '展开' : '收起'}</button>
          <button className={styles.follow}>关注</button>
        </div>
      </div>
      <Bubble>
        <div className={styles.pcFloorInfo}>
          <span className={styles.sign}>{index + '#'}</span>
          <span className={styles.createTime}>发表于：{topic.gmtCreate}</span>
        </div>
        <div
          className={[styles.content, hide ? styles.hide : null].join(' ')}
          dangerouslySetInnerHTML={{ __html: topic.content }}
        />
      </Bubble>
    </div>
  )
}