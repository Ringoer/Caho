import { useState } from 'react'
import styles from './Floor.less'
import Bubble from './Bubble'
import Button from './Button'
import { Link } from 'umi'
import request from '@/util/request'
import { Swal } from '@/util/swal'

export default (props: any) => {
  const { reply, index, onReply, onReport }: { reply: Reply, index: number, onReply: Function, onReport: Function } = props
  const [hide, setHide] = useState(false)

  function follow() {
    Swal.confirm('您真的要关注该用户吗')
      .then((res) => {
        if (!res) {
          return
        }
        request('/user/follow', {
          method: 'post',
          body: JSON.stringify({
            followId: reply.userId
          })
        }).then(res => {
          if (res.errno === 0) {
            Swal.success('关注成功！')
          } else {
            Swal.error(`关注失败！\n原因：${res.errmsg}`)
          }
        })
      })
  }

  return (
    <div className={styles.floor}>
      <div className={styles.author}>
        <Link to={'/user/' + reply.userId} className={styles.img}>
          <img src={reply.userAvatarUrl} alt="头像" />
        </Link>
        <div className={styles.authorInfo}>
          <Link to={'/user/' + reply.userId}>
            {reply.userNickname}
          </Link>
          <span className={styles.mobileFloorInfo}>{`第${index}楼 ` + reply.gmtCreate}</span>
        </div>
        <div className={styles.userAction}>
          <Button
            backgroundColor='white'
            color='black'
            onClick={() => setHide(!hide)}
          >
            {hide ? '展开' : '收起'}
          </Button>
          <Button
            className={styles.follow}
            onClick={follow}>
            关注
            </Button>
        </div>
      </div>
      <Bubble>
        <div className={styles.pcFloorInfo}>
          <span className={styles.sign}>{index + '#'}</span>
          <span className={styles.createTime}>发表于：{reply.gmtCreate}</span>
        </div>
        <div
          className={[styles.content, hide ? styles.hide : null].join(' ')}
          dangerouslySetInnerHTML={{ __html: reply.content }}
        />
        <div className={styles.replyAction}>
          <Button type='plain' onClick={() => onReply(reply.userId, reply.userNickname)}>回复</Button>
          {index === 1 ? undefined : <Button type='plain' onClick={() => onReport(reply.id)}>举报</Button>}
        </div>
      </Bubble>
    </div>
  )
}