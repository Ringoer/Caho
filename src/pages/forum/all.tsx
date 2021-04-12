import { useEffect, useState } from 'react';
import styles from './all.less';
import request from '@/util/request'
import { connect, Link } from 'umi'

import Loading from '@/components/Loading'
import Section from '@/components/Section';

export default connect(({ breadcrumb }: { breadcrumb: Breadcrumb[] }) => ({ breadcrumb }))((props: any) => {
  const [forums, setForums] = useState<Forum[]>()

  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: '/forum/all', name: '[版块] 所有版块' }] })
  }, [])

  useEffect(() => {
    request('/forum')
      .then(result => {
        if (result.errno === 0) {
          setForums(result.data)
        } else {
          console.error(result.errmsg)
        }
      })
  }, [])

  return (
    <div className={styles.container}>
      <Section color="#5CD1F0" title="所有版块">
        {!forums ? <Loading /> : (
          <ul className={styles.forums}>
            {forums.map((forum: Forum) => (
              <li key={forum.id}>
                <Link to={`/forum/${forum.id}`} className={styles.forum}>
                  <img src={forum.avatarUrl} alt="版块头像" />
                  <span className={styles.forumName}>{forum.forumName}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
})