import styles from './_layout.less';
import Section from '@/components/Section'
import Loading from '@/components/Loading'
import { connect } from 'umi';

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user } = props
  return (
    <div className={styles.main}>
      {props.children}
      <div className={styles.sidebar}>
        {!user ? <Loading /> : (
          <Section color="#FFCF4B" title="个人信息">
            <div className={styles.user}>
              <div className={styles.avatar}>
                <img src={user.avatar_url} alt="头像" />
              </div>
              <div className={styles.info}>
                <span>{user.githubUsername}</span>
                <br />
                <span>积分：0</span>
              </div>
            </div>
          </Section>)}
        <Section color="#FC83A3" title="推荐内容">
          <div className={styles.recommend}>推荐的内容</div>
        </Section>
      </div>
    </div>
  );
})