import styles from './add.less';
import { useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import request from '@/util/request';
import { Swal } from '@/util/swal';

export default connect(({ breadcrumb }: { breadcrumb: Breadcrumb[] }) => ({ breadcrumb }))((props: any) => {
  const forumName = useRef<HTMLInputElement>(null)
  const description = useRef<HTMLInputElement>(null)

  const [flag, setFlag] = useState(false)
  const [state, fresh] = useState(0)
  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: '/forum/add', name: '[版块] 新建版块' }] })
  }, [])
  useEffect(() => {
    if (!flag) {
      return
    }
    if (flag) {
      if (!forumName.current || !description.current) {
        setFlag(false)
        return
      }
      request('/forum', {
        method: 'post',
        body: JSON.stringify({
          forumName: forumName.current.value,
          description: description.current.value
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
    }
  }, [flag])
  return (
    <div className={styles.container}>
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
    </div>
  );
})