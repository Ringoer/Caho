import { useState } from 'react'
import styles from './Floor.less'
import Bubble from './Bubble'
import { Link } from 'umi'

let hideHeight: string = localStorage.getItem('device') === 'pc' ? '204.01px' : '40px'
window.onresize = () => {
  hideHeight = localStorage.getItem('device') === 'pc' ? '122.01px' : '40px'
}

export default (props: any) => {
  const { topic, index } = props
  const [hide, setHide] = useState(false)
  return (
    <div className={styles.floor + (localStorage.getItem('device') === 'pc' ? '' : ' ' + styles.mobile)}>
      <div className={styles.author}>
        <Link to={'/user/' + topic.author.loginname} className={styles.img}>
          <img src={topic.author.avatar_url} alt="头像" />
        </Link>
        <div className={styles.authorInfo}>
          <Link to={'/user/' + topic.author.loginname}>
            {topic.author.loginname}
          </Link>
          {localStorage.getItem('device') === 'pc' ? undefined : (
            <span className={styles.createTime}>{`第${index}楼 ` + topic.create_at}</span>
          )}
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.hide}
            onClick={() => setHide(!hide)}>{hide ? '展开' : '收起'}</button>
          <button className={styles.follow}>关注</button>
        </div>
      </div>
      <Bubble>
        {localStorage.getItem('device') === 'pc' ? (
          <>
            <div className={styles.floorInfo}>
              <span className={styles.sign}>{index + '#'}</span>
              <span className={styles.createTime}>发表于：{topic.create_at}</span>
            </div>
          </>
        ) : undefined}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: topic.content }}
          style={{ height: hide ? hideHeight : 'auto' }}
        ></div>
      </Bubble>
    </div>
  )
}