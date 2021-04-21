import { connect, history, Link } from 'umi'
import Editor from '@/components/Editor'
import { useEffect } from 'react'
import { Swal } from '@/util/swal'
import request from '@/util/request'

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user } = props
  // @ts-ignore
  const toUser: User = history.location.state

  if (!user || !toUser) {
    history.push('/404')
    return (
      <>
        非法的操作
      </>
    )
  }

  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: location.pathname, name: '[功能] 发送私信' }] })
  }, [])

  function onSubmit(content: string, title: string) {
    if (!user) {
      Swal.error('您尚未登录！')
      return
    }
    if (!toUser) {
      Swal.error('您尚未选中收件人')
      return
    }
    if (toUser.id === user.id) {
      Swal.error('不可以发送私信给自己')
      return
    }
    if (!content || !title) {
      Swal.error('标题及内容均不能为空！')
      return
    }
    request('/message', {
      method: 'post',
      body: JSON.stringify({
        title,
        content,
        toIds: [toUser.id]
      })
    }).then(result => {
      if (result.errno !== 0) {
        Swal.error('发送私信失败！')
        return
      } else {
        Swal.success('发送私信成功！')
          .then(() => {
            history.goBack()
          })
        return
      }
    })
  }

  return (
    <>
      <p style={{ margin: '0 12px' }}>
        收件人：
      <Link to={`/user/${toUser.id}`}>{`${toUser.nickname} ( ${toUser.username} )`}</Link>
      </p>
      <Editor
        hasTitle
        onSubmit={onSubmit}
      />
    </>
  )
})