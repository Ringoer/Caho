import { useEffect, useState } from 'react';
import styles from './profile.less';
import request from '@/util/request'
import { connect } from 'umi'
import Section from '@/components/Section';
import Loading from '@/components/Loading';
import marked from 'marked';
import 'github-markdown-css/github-markdown.css'

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user, userId } = props
  const [profile, setProfile] = useState<string>()

  const [_, fresh] = useState(0)

  useEffect(() => {
    if (userId === '0' || !Number.isInteger(+userId)) {
      setProfile('暂无更多')
      return
    }
    request(`/user/${userId}/profile`).then(result => {
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
  }, [])
  return (
    <div className={styles.profile}>
      {profile ? (
        <>
          <div className={styles.first}>
            <Section title="个人介绍">
              <article
                className='markdown-body'
                dangerouslySetInnerHTML={{ __html: marked(profile || '暂无更多') }}
                style={{ padding: '8px' }}
              />
            </Section>
          </div>
          <div className={styles.second}>
            <Section color="#FFCF4B" title="个人资料">
              暂无更多
          </Section>
            <Section color="#FC83A3" title="社交媒体">
              暂无更多
          </Section>
          </div>
        </>
      ) : <Loading />}
    </div>
  )
})