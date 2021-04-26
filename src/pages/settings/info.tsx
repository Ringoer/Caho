import styles from './info.less'
import ImageUploader from "@/components/ImageUploader"
import Note from "@/components/Note"
import { connect } from 'umi'
import { Swal } from '@/util/swal'
import request from '@/util/request'
import Loading from '@/components/Loading'
import { useEffect, useRef, useState } from 'react'
import Button from '@/components/Button'
import Popup from '@/components/Popup'

import Album from '@/pages/user/album'
import Image from '@/components/Image'

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user }: { user: User } = props

  const [hide, setHide] = useState(true)
  const [avatar, setAvatar] = useState('')

  const nickname = useRef<HTMLInputElement>(null)
  const signature = useRef<HTMLInputElement>(null)

  function onAvatar(files: FileList) {
    const file = files[0]
    if (file.size > 1024 * 1024) {
      Swal.error('您只能上传不大于 1MB 的图片')
      return
    }
    Swal.confirm('修改头像将消耗 2 点积分\n您确定要修改吗？')
      .then(res => {
        if (!res) {
          return
        }
        const body = new FormData()
        body.append('file', file)
        request('/file/avatar', {
          method: 'post',
          body,
        }, true).then(result => {
          if (result.errno === 0) {
            Swal.success('上传成功！')
              .then(() => {
                location.reload()
              })
            return
          } else {
            Swal.error('上传失败！')
            return
          }
        })
      })
  }

  function onAlbum() {
    Swal.confirm('修改头像将消耗 2 点积分\n您确定要修改吗？')
      .then(res => {
        if (!res) {
          return
        }
        if (!avatar) {
          return
        }
        const newUser = user
        newUser.avatarUrl = avatar
        request('/user', {
          method: 'put',
          body: JSON.stringify({
            user: newUser,
            attributes: ['avatarUrl']
          }),
        }).then(result => {
          if (result.errno === 0) {
            Swal.success('修改成功！')
              .then(() => {
                location.reload()
              })
            return
          } else {
            Swal.error('修改失败！')
            return
          }
        })
      })
  }

  function onNickname() {
    Swal.confirm('修改昵称将消耗 2 点积分\n您确定要修改吗？')
      .then(res => {
        if (!res) {
          return
        }
        if (!nickname.current) {
          return
        }
        if (!nickname.current.value) {
          Swal.error('昵称不可以为空')
          return
        }
        const newUser = user
        newUser.nickname = nickname.current.value
        request('/user', {
          method: 'put',
          body: JSON.stringify({
            user: newUser,
            attributes: ['nickname']
          }),
        }).then(result => {
          if (result.errno === 0) {
            Swal.success('修改成功！')
              .then(() => {
                location.reload()
              })
            return
          } else {
            Swal.error('修改失败！')
            return
          }
        })
      })
  }

  function onSignature() {
    Swal.confirm('您确定要修改个性签名吗？')
      .then(res => {
        if (!res) {
          return
        }
        if (!signature.current) {
          return
        }
        const newUser = user
        newUser.signature = signature.current.value
        request('/user', {
          method: 'put',
          body: JSON.stringify({
            user: newUser,
            attributes: ['signature']
          }),
        }).then(result => {
          if (result.errno === 0) {
            Swal.success('修改成功！')
              .then(() => {
                location.reload()
              })
            return
          } else {
            Swal.error('修改失败！')
            return
          }
        })
      })
  }

  useEffect(() => {
    if (!user) {
      return
    }
    setAvatar(user.avatarUrl)
  }, [])

  return (
    user ? (
      <ul>
        <li>
          <Note>
            <div className={styles.container}>
              <p>设置头像 - 直接上传</p>
              <ImageUploader src={user.avatarUrl} onSubmit={onAvatar} />
            </div>
          </Note>
          <Note>
            <div className={styles.container}>
              <p>设置头像 - 来自相册</p>
              <div className={styles.fromAlbum}>
                <Button onClick={() => setHide(!hide)}>
                  <span>从相册中选择</span>
                  <Popup hide={hide}>
                    <div onClick={(event) => {
                      event.stopPropagation()
                    }}>
                      <Album userId={user.id} onClick={(src: string) => {
                        setAvatar(src)
                        setHide(true)
                      }} />
                    </div>
                  </Popup>
                </Button>
                <Button onClick={onAlbum}>确定</Button>
              </div>
              <Image src={avatar} />
            </div>
          </Note>
          <Note>
            <div className={styles.container}>
              <div className={styles.wrapper}>
                <span>{['旧昵称', user.nickname].join(' ')}</span>
                <span></span>
              </div>
              <div className={styles.wrapper}>
                <label htmlFor="nickname">新昵称</label>
                &nbsp;
                <input type="text" name="nickname" id="nickname" defaultValue={user.nickname} ref={nickname} />
              </div>
              <div className={styles.wrapper}>
                <Button onClick={onNickname}>
                  确认修改
                </Button>
              </div>
            </div>
          </Note>
          <Note>
            <div className={styles.container}>
              <div className={styles.wrapper}>
                <span>{['旧个性签名', user.signature || '无'].join(' ')}</span>
                <span></span>
              </div>
              <div className={styles.wrapper}>
                <label htmlFor="signature" style={{ whiteSpace: 'nowrap' }}>新个性签名</label>
                &nbsp;
                <input type="text" name="signature" id="signature" defaultValue={user.signature} ref={signature} />
              </div>
              <div className={styles.wrapper}>
                <Button onClick={onSignature}>
                  确认修改
                </Button>
              </div>
            </div>
          </Note>
          <Note>
            <div className={styles.container}>
              暂不支持修改密码和邮箱
            </div>
          </Note>
        </li>
      </ul>
    ) : <Loading />
  )
})