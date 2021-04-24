import styles from './_layout.less';
import { connect } from 'umi';
import { useEffect, useState } from 'react';
import Tabs from '@/components/Tabs';
import Tab from '@/components/Tab';

import Displayer from './displayer'

import 'github-markdown-css'

const options = ['通知', '提及', '私信', '发件',]
const tabHash = {
  '私信': 0,
  '通知': 1,
  '提及': 2,
  '发件': 3,
}

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user } = props

  const [option, setOption] = useState(options[0])

  const [messagess, setMessagess] = useState<Message[][]>()

  const [clientWidth, setClientWidth] = useState(document.body.clientWidth)

  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: location.pathname, name: '[功能] 消息列表' }] })
  }, [])

  window.onresize = () => {
    setClientWidth(document.body.clientWidth)
  }

  return (
    <div className={styles.container}>
      <Tabs itemWidth='25%' itemHeight='32px' onChange={
        (tab: string) => {
          setOption(tab)
        }
      }>
        {options.map(tab => (
          <Tab key={tab} title={tab} name={tab}></Tab>
        ))}
      </Tabs>
      <div>
        <Displayer key={option} tab={tabHash[option]} />
      </div>
    </div>
  )
})