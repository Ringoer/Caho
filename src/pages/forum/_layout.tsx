import styles from './_layout.less';
import Section from '@/components/Section'
import Loading from '@/components/Loading'
import { connect, Link } from 'umi';
import { useEffect, useState } from 'react';
import request from '@/util/request';
import Note from '@/components/Note';
import { changeTime } from '@/util/time';
import Button from '@/components/Button';
import { Swal } from '@/util/swal';

export default connect(({ user, login }: { user: User, login: string }) => ({ user, login }))((props: any) => {
  const { user, login } = props
  const [recommends, setRecommends] = useState<Topic[]>([])
  const [flag, setFlag] = useState(false)

  const [sign, setSign] = useState(true)

  function onSign() {
    if (!user) {
      return
    }
    if (sign) {
      Swal.info('您今天已经签过到了')
      return
    }
    request('/score/sign', {
      method: 'post',
    }).then(result => {
      if (result.errno === 0) {
        Swal.success('签到成功！')
          .then(() => {
            setSign(true)
          })
      }
    })
  }

  useEffect(() => {
    if (!login) {
      return
    }
    if (login === 'unlogin') {
      setFlag(true)
      return
    }
    if (!user) {
      return
    }
    request('/topic/recommend')
      .then(res => {
        setFlag(true)
        if (res.errno !== 0) {
          return
        }
        setRecommends(res.data)
      })

    request('/score/sign')
      .then(result => {
        if (result.errno !== 0) {
          return
        }
        const { data } = result
        if (typeof data === 'boolean') {
          setSign(data)
        }
      })
  }, [user, login])
  return (
    <div className={styles.main}>
      {props.children}
      <div className={[styles.sidebar, location.pathname === '/forum' ? styles.index : ''].join(' ')}>
        {flag ? (
          <>
            <Section color="#FFCF4B" title="个人信息">
              {!user ? (
                <p>
                  还没登录？立即
                  <Link to='/login' className={styles.login}> 登录 </Link>
            ！
                </p>
              ) : (
                <div className={styles.user}>
                  <div className={styles.avatar}>
                    <Link to={`/user/${user.id}`}>
                      <img src={user.avatarUrl} alt="头像" />
                    </Link>
                  </div>
                  <div className={styles.info}>
                    <Link to={`/user/${user.id}`}>
                      <span>{user.nickname}</span>
                    </Link>
                    <span>积分：{user.score}</span>
                    {sign ? (
                      <Button backgroundColor='white' color='black'>
                        已签到
                      </Button>
                    ) : (
                      <Button onClick={onSign}>
                        <div className={styles.sign}>
                          <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-sign"></use>
                          </svg>
                          <span>签到</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>)}
            </Section>
            <Section color="#FC83A3" title="推荐内容">
              <ul className={styles.recommends}>
                {recommends.length === 0 ?
                  <li>暂无推荐内容</li> :
                  recommends.map(recommend => (
                    <li className={styles.recommendWrapper} key={recommend.id}>
                      <Link to={`/forum/topic/${recommend.id}`}>
                        <Note>
                          <div className={styles.recommend}>
                            <span className={styles.title}>{recommend.title}</span>
                            <span className={styles.lastReplyAt}>{changeTime(recommend.lastReplyAt)}</span>
                          </div>
                        </Note>
                      </Link>
                    </li>
                  ))}
              </ul>
            </Section>
          </>
        ) : (
          <>
            <Section color="#FFCF4B" title="个人信息">
              <Loading />
            </Section>
            <Section color="#FC83A3" title="推荐内容">
              <Loading />
            </Section>
          </>
        )}
      </div>
    </div>
  );
})