import { useEffect, useState } from 'react';
import styles from './follow.less';
import request from '@/util/request'
import { connect, Link, history } from 'umi'
import Tabs from '@/components/Tabs';
import Tab from '@/components/Tab';
import Loading from '@/components/Loading';
import Note from '@/components/Note';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user, userId } = props
  const [followsSelectedPage, setFollowsSelectedPage] = useState('1')
  const [fansSelectedPage, setFansSelectedPage] = useState('1')
  const [follows, setFollows] = useState<User[]>()
  const [fans, setFans] = useState<User[]>()

  const [_, fresh] = useState(0)

  useEffect(() => {
    if (userId === '0') {
      return
    }
    if (!Number.isInteger(+userId)) {
      return
    }
    request(`/user/${userId}/follow`).then(result => {
      const { data } = result
      if (!data) {
        return
      }
      const { follows, fans } = data
      setFollows(follows || [])
      setFans(fans || [])
    })
  }, [])
  useEffect(() => {
    fresh(Math.random())
  }, [followsSelectedPage, fansSelectedPage])
  window.onresize = () => fresh(Math.random())
  return (
    <div className={styles.collect}>
      {follows && fans ? (
        <>
          <div className={styles.row}>
            <Tabs direction='row' itemWidth='50%' itemHeight='48px' key={_}>
              <Tab title='关注' name='follows'>
                {follows.length === 0 ? '暂无更多' : (
                  <ul>
                    {follows.slice(10 * (+followsSelectedPage - 1), 10 * +followsSelectedPage).map(follow => (
                      <li key={follow.id}>
                        <Note>
                          <div className={styles.follow}>
                            <Link to={`/user/${follow.id}`}>
                              <div className={styles.img}>
                                <img src={follow.avatarUrl} alt="用户头像" />
                              </div>
                              <span className={styles.nickname}>{follow.nickname}</span>
                              <span className={styles.signature}>{follow.signature || '这个人很懒，什么也没写...'}</span>
                              <div className={styles.action}>
                                {user && user.id === userId ? (
                                  <Button backgroundColor='white' color='black' onClick={(event: Event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    console.log(event)
                                  }}>取消关注</Button>
                                ) : undefined}
                              </div>
                            </Link>
                          </div>
                        </Note>
                      </li>
                    ))}
                  </ul>
                )}
                {+follows.length > 0 ? (
                  <Pagination
                    count={follows.length}
                    selectedPage={followsSelectedPage}
                    action={(target: string) => setFollowsSelectedPage(target)}
                  />
                ) : undefined}
              </Tab>
              <Tab title='粉丝' name='fans'>
                {fans.length === 0 ? '暂无更多' : (
                  <ul>
                    {fans.slice(10 * (+fansSelectedPage - 1), 10 * +fansSelectedPage).map(follow => (
                      <li key={follow.id}>
                        <Note>
                          <div className={styles.follow}>
                            <Link to={`/user/${follow.id}`}>
                              <div className={styles.img}>
                                <img src={follow.avatarUrl} alt="用户头像" />
                              </div>
                              <span className={styles.nickname}>{follow.nickname}</span>
                              <span className={styles.signature}>{follow.signature || '这个人很懒，什么也没写...'}</span>
                              <div className={styles.action}>
                                {user && user.id === userId ? (
                                  <Button backgroundColor='white' color='black' onClick={(event: Event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    console.log(event)
                                  }}>取消关注</Button>
                                ) : undefined}
                              </div>
                            </Link>
                          </div>
                        </Note>
                      </li>
                    ))}
                  </ul>
                )}
                {+fans.length > 0 ? (
                  <Pagination
                    count={fans.length}
                    selectedPage={fansSelectedPage}
                    action={(target: string) => {
                      console.log({ target })
                      setFansSelectedPage(target)
                    }}
                  />
                ) : undefined}
              </Tab>
            </Tabs>
          </div>
          <div className={styles.column}>
            <Tabs direction='column' itemWidth='80px' itemHeight='48px' key={_}>
              <Tab title='关注' name='follows'>
                {follows.length === 0 ? '暂无更多' : (
                  <ul>
                    {follows.slice(10 * (+followsSelectedPage - 1), 10 * +followsSelectedPage).map(follow => (
                      <li key={follow.id}>
                        <Note>
                          <div className={styles.follow}>
                            <Link to={`/user/${follow.id}`}>
                              <div className={styles.img}>
                                <img src={follow.avatarUrl} alt="用户头像" />
                              </div>
                              <span className={styles.nickname}>{follow.nickname}</span>
                              <span className={styles.signature}>{follow.signature || '这个人很懒，什么也没写...'}</span>
                              <div className={styles.action}>
                                {user && user.id === userId ? (
                                  <Button backgroundColor='white' color='black' onClick={(event: Event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    console.log(event)
                                  }}>取消关注</Button>
                                ) : undefined}
                              </div>
                            </Link>
                          </div>
                        </Note>
                      </li>
                    ))}
                  </ul>
                )}
                {+follows.length > 0 ? (
                  <Pagination
                    count={follows.length}
                    selectedPage={followsSelectedPage}
                    action={(target: string) => setFollowsSelectedPage(target)}
                  />
                ) : undefined}
              </Tab>
              <Tab title='粉丝' name='fans'>
                {fans.length === 0 ? '暂无更多' : (
                  <ul>
                    {fans.slice(10 * (+fansSelectedPage - 1), 10 * +fansSelectedPage).map(follow => (
                      <li key={follow.id}>
                        <Note>
                          <div className={styles.follow}>
                            <Link to={`/user/${follow.id}`}>
                              <div className={styles.img}>
                                <img src={follow.avatarUrl} alt="用户头像" />
                              </div>
                              <span className={styles.nickname}>{follow.nickname}</span>
                              <span className={styles.signature}>{follow.signature || '这个人很懒，什么也没写...'}</span>
                              <div className={styles.action}>
                                {user && user.id === userId ? (
                                  <Button backgroundColor='white' color='black' onClick={(event: Event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    console.log(event)
                                  }}>取消关注</Button>
                                ) : undefined}
                              </div>
                            </Link>
                          </div>
                        </Note>
                      </li>
                    ))}
                  </ul>
                )}
                {+fans.length > 0 ? (
                  <Pagination
                    count={fans.length}
                    selectedPage={fansSelectedPage}
                    action={(target: string) => {
                      console.log({ target })
                      setFansSelectedPage(target)
                    }}
                  />
                ) : undefined}
              </Tab>
            </Tabs>
          </div>
        </>
      ) : <Loading />}
    </div>
  )
})