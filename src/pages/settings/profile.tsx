import styles from './profile.less'
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
import Editor from '@/components/Editor'
import marked from 'marked'

import 'github-markdown-css/github-markdown.css'

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user }: { user: User } = props

  const [profile, setProfile] = useState<string>()

  const [hide, setHide] = useState(true)
  const [insertValue, setInsertValue] = useState('')

  function onSubmit(text: string) {
    if (!user) {
      return
    }
    Swal.confirm('您确定要修改个人介绍吗？')
      .then(res => {
        if (!res || !user) {
          return
        }
        request('/user/profile', {
          method: 'put',
          body: JSON.stringify({
            profile: text
          })
        }).then(result => {
          if (result.errno !== 0) {
            Swal.error('修改失败！')
            return
          }
          setProfile(text)
          Swal.success('修改成功！')
        })
      })
  }

  useEffect(() => {
    if (!user) {
      return
    }

    request(`/user/${user.id}/profile`).then(result => {
      if (result.errno !== 0) {
        setProfile('暂无更多')
        return
      }
      const { data } = result
      if (data && data.profile) {
        setProfile(data.profile)
      } else {
        setProfile('暂无更多')
      }
    })
  }, [user])

  return (
    user ? (
      <ul>
        <li>
          <Note>
            <div className={styles.container}>
              <div className={styles.editorWrapper}>
                <div className={styles.editorTitleWrapper}>
                  <span className={styles.editorTitle}>修改个人介绍</span>
                  {user ? (
                    <div className={styles.actions}>
                      <div className={styles.action}>
                        <div className={styles.fromAlbum}>
                          <Button onClick={() => setHide(!hide)}>
                            <span>插入图片</span>
                            <Popup hide={hide}>
                              <div onClick={(event) => {
                                event.stopPropagation()
                              }}>
                                <Album userId={user.id} onClick={(src: string) => {
                                  setInsertValue(`![图片](${src})`)
                                  setHide(true)
                                }} />
                              </div>
                            </Popup>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : undefined}
                </div>
                <Editor
                  onSubmit={onSubmit}
                  insertValue={insertValue}
                />
              </div>
            </div>
          </Note>
          <Note>
            <div className={styles.container}>
              <div className={styles.profileWrapper}>
                <p>原本的个人介绍</p>
                <article className='markdown-body' dangerouslySetInnerHTML={{ __html: marked(profile || '') }} />
              </div>
            </div>
          </Note>
        </li>
      </ul>
    ) : <Loading />
  )
})