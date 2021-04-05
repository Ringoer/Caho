import styles from './index.less';
import Section from '@/components/Section'
import Loading from '@/components/Loading'
import { connect, Link } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';

export default connect(({ user, breadcrumb }: { user: any, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const { user } = props
  const [forums, setForums] = useState<Forum[]>([])
  useEffect(() => {
    // fetch('/api/forums')
    // getForums
    if (user) {
      request('/forum/collect')
        .then(result => {
          if (result.errno === 0) {
            setForums(result.data)
          }
        })
    } else {
      request('/forum')
        .then(result => {
          if (result.errno === 0) {
            setForums(result.data)
          }
        })
    }
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 0, pathname: '/', name: '首页' }] })
  }, [])
  return (
    <div className={styles.content}>
      <Section color="#5CD1F0" title="关注">
        {forums.length === 0 ? (
          <div className={styles.default}>
            <span>暂无关注的版块</span>
          </div>
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
              <li>
                <Link to={'/forum/add'} className={styles.forum}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-add"></use>
                  </svg>
                  <div>新建版块</div>
                </Link>
              </li>
            ) : undefined}
          </ul>
        )}
      </Section>
    </div>
  );
})
