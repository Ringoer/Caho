import styles from './settings.less';
import { useEffect, useRef, useState } from 'react';
import { connect, history, Link } from 'umi';
import request from '@/util/request';
import { Swal } from '@/util/swal';
import Tabs from '@/components/Tabs';
import Tab from '@/components/Tab';
import Note from '@/components/Note';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import ImageUploader from '@/components/ImageUploader';

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user }: { user: User } = props

  useEffect(() => {
    if (!user) {
      history.push('/')
      return
    }
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: '/settings', name: '[功能] 设置' }] })
  }, [user])

  function onSubmit(files: FileList) {
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

  return (
    <div className={styles.settings}>
      {user ? (
        <>
          <div>
            <p>设置头像（请尽量选择正方形图片）</p>
            <ImageUploader src={user.avatarUrl} onSubmit={onSubmit} />
          </div>
        </>
      ) : <Loading />}
    </div>
  )
})