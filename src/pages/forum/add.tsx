import styles from './add.less';
import { useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import request from '@/util/request';
import { Swal } from '@/util/swal';
import Button from '@/components/Button';
import Popup from '@/components/Popup';

import Album from '@/pages/user/album'
import Loading from '@/components/Loading';
import Image from '@/components/Image';

const defaultAvatarUrl = 'https://ali.ringoer.com/cdn/caho/avatar/default_forum_avatar.png'

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user } = props

  const forumName = useRef<HTMLInputElement>(null)
  const description = useRef<HTMLInputElement>(null)
  const [src, setSrc] = useState(defaultAvatarUrl)

  const [hide, setHide] = useState(true)
  const [flag, setFlag] = useState(false)
  const [state, fresh] = useState(0)
  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: '/forum/add', name: '[版块] 新建版块' }] })
  }, [])
  useEffect(() => {
    if (!flag) {
      return
    }
    Swal.confirm('您确定要提交申请吗？')
      .then(res => {
        if (!res) {
          return
        }
        if (!forumName.current || !description.current) {
          setFlag(false)
          return
        }
        request('/forum', {
          method: 'post',
          body: JSON.stringify({
            forumName: forumName.current.value,
            description: description.current.value,
            avatarUrl: src
          })
        }).then(result => {
          if (result.errno === 0) {
            Swal.success('提交新建版块请求成功！\n请等待管理员审核')
              .then(() => {
                location.href = '/'
              })
            return
          } else {
            Swal.error(result.errmsg)
          }
        })
        setFlag(false)
      })
  }, [flag])
  return (
    <div className={styles.container}>
      {user ? (
        <form className={styles.addForumForm} onSubmit={event => { event.preventDefault(); setFlag(true) }}>
          <div className={styles.wrapper}>
            <label htmlFor="forumName">版块名称</label>
            <input type="text" name="forumName" id="forumName" ref={forumName} onChange={() => fresh(Math.random())} />
            {state !== 0 && !(forumName.current && forumName.current.value) ? <label htmlFor="forumName" className={styles.warning}>版块名称不能为空！</label> : undefined}
          </div>
          <div className={styles.wrapper}>
            <label htmlFor="description">版块介绍</label>
            <input type="text" name="description" id="description" ref={description} onChange={() => fresh(Math.random())} />
            {state !== 0 && !(description.current && description.current.value) ? <label htmlFor="description" className={styles.warning}>版块介绍不能为空！</label> : undefined}
          </div>
          <div className={styles.wrapper}>
            <label htmlFor="avatar">版块头像</label>
            <div className={styles.fromAlbum}>
              <Button onClick={(event: Event) => {
                event.preventDefault()
                setHide(!hide)
              }}>
                <span>选择图片</span>
                <Popup hide={hide}>
                  <div onClick={(event) => {
                    event.stopPropagation()
                  }}>
                    <Album userId={user.id} onClick={(src: string) => {
                      setSrc(src)
                      setHide(true)
                    }} />
                  </div>
                </Popup>
              </Button>
            </div>
            <Image src={src} scale='100%' />
          </div>
          <div className={styles.action}>
            <button className={styles.submit}>提交</button>
            <button onClick={event => {
              event.preventDefault()
              if (forumName.current) {
                forumName.current.value = ''
              }
              if (description.current) {
                description.current.value = ''
              }
            }} className={styles.reset}>重置</button>
          </div>
        </form>
      ) : <Loading />}
    </div>
  );
})