import { connect, history, Link } from 'umi'
import { useEffect } from 'react'
import { Swal } from '@/util/swal'
import request from '@/util/request'
import marked from 'marked'

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user } = props
  // @ts-ignore
  const message: Message = history.location.state

  if (!user || !message) {
    history.push('/404')
    return (
      <>
        非法的操作
      </>
    )
  }

  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 2, pathname: location.pathname, name: `[私信] ${message.title}` }] })
  }, [])

  return (
    <div>
      <p>
        发件人：
        <Link to={`/user/${message.fromId}`}>{`${message.fromNickname} ( ${message.fromUsername} )`}</Link>
      </p>
      <p>
        收件人：
        <Link to={`/user/${message.toId}`}>{`${message.toNickname} ( ${message.toUsername} )`}</Link>
      </p>
      <p>
        标题：{message.title}
      </p>
      <p>内容：</p>
      <article className='markdown-body' dangerouslySetInnerHTML={{ __html: marked(message.content) }} />
    </div>
  )
})