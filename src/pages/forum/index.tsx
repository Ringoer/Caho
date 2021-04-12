import styles from './index.less';
import Section from '@/components/Section'
import Loading from '@/components/Loading'
import { connect, Link } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';

let sign: NodeJS.Timeout

export default connect(({ user, breadcrumb }: { user: any, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user } = props
  const [forums, setForums] = useState<Forum[]>([])
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 0, pathname: '/', name: '首页' }] })
    sign = setTimeout(() => setFlag(true), 1000)
  }, [])
  useEffect(() => {
    if (!user) {
      return
    }
    clearTimeout(sign)
    request('/forum/collect')
      .then(result => {
        setFlag(true)
        if (result.errno === 0) {
          setForums(result.data)
        }
      })
  }, [user])
  return (
    <div className={styles.content}>
      <Section color="#5CD1F0" title="关注">
        {flag ? (
          forums.length === 0 ? (
            <ul className={styles.forums}>
              <li>
                <Link to={'/forum/all'} className={styles.forum}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-search"></use>
                  </svg>
                  <div>查看所有版块</div>
                </Link>
              </li>
            </ul>
          ) : (
            <ul className={styles.forums}>
              {forums.map((forum: Forum) => (
                <li key={forum.id}>
                  <Link to={`/forum/${forum.id}`} className={styles.forum}>
                    <img src={forum.avatarUrl} alt="版块头像" />
                    <div>{forum.forumName}</div>
                  </Link>
                </li>
              ))}
              {user ? (
                <>
                  <li>
                    <Link to={'/forum/add'} className={styles.forum}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-add"></use>
                      </svg>
                      <div>新建版块</div>
                    </Link>
                  </li>
                  <li>
                    <Link to={'/forum/all'} className={styles.forum}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-search"></use>
                      </svg>
                      <div>查看所有版块</div>
                    </Link>
                  </li>
                </>
              ) : undefined}
            </ul>
          )
        ) : <Loading />}
      </Section>
    </div>
  );
})
