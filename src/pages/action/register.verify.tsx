import styles from './register.less';
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import request from '@/util/request';

export default connect(({ user, breadcrumb }: { user: User, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { jwt } = props.location.query
  const [message, setMessage] = useState('注册成功！')
  useEffect(() => {
    console.log(jwt)
    if (!jwt) {
      return
    }
    request('/user/register/verify', {
      method: 'post',
      body: JSON.stringify({ jwt })
    }).then(res => {
      if (res.errno !== 0) {
        setMessage('注册失败！')
      }
    })
  }, [])
  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: '/register/verify', name: '注册验证' }] })
  }, [])
  return (
    <div className={styles.container}>
      <p>{message}</p>
    </div>
  );
})