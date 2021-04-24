import styles from './_layout.less';
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

import Info from './info';
import Score from './Score';
import Profile from './Profile';

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user }: { user: User } = props

  const [clientWidth, setClientWidth] = useState(document.body.clientWidth)

  useEffect(() => {
    if (!user) {
      history.push('/')
      return
    }
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: '/settings', name: '[功能] 设置' }] })
  }, [user])

  window.onresize = () => {
    setClientWidth(document.body.clientWidth)
  }

  return (
    <div className={styles.settings}>
      {user ? (
        <Tabs itemWidth='50%' itemHeight='32px'>
          <Tab title='修改资料' name='info'>
            <Info />
          </Tab>
          <Tab title='修改介绍' name='profile'>
            <Profile />
          </Tab>
          <Tab title='查询积分' name='score'>
            <Score />
          </Tab>
        </Tabs>
      ) : <Loading />}
    </div>
  )
})