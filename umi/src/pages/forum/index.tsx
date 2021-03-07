import styles from './index.less';
import Section from '@/components/Section'
import { connect, Link } from 'umi';
import { useEffect, useState } from 'react';

const getForums = new Promise(resolve => {
  resolve({
    json: () => ({
      data: [
        { id: 1, src: 'http://pic.ringoer.com/64928049_p0.png', name: 'CNODE社区', href: '/forum/1' },
      ]
    })
  })
})

export default connect(({ user, breadcrumb }: { user: any, breadcrumb: Breadcrumb[] }) => ({ user, breadcrumb }))((props: any) => {
  const [forums, setForums] = useState([])
  useEffect(() => {
    // fetch('/api/forums')
    getForums
      .then((res: any) => res.json())
      .then(result => setForums(result.data))
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
            {forums.map((item: any) => {
              return (
                <li key={item.id}>
                  <Link to={item.href} className={styles.forum}>
                    <img src={item.src} alt="版块头像" />
                    <div>{item.name}</div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </Section>
    </div>
  );
})
