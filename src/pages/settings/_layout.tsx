import styles from './_layout.less';
import { useEffect } from 'react';
import { connect, history } from 'umi';
import Tabs from '@/components/Tabs';
import Tab from '@/components/Tab';
import Loading from '@/components/Loading';

import Info from './info';
import Score from './Score';
import Profile from './Profile';

export default connect(
  ({ user, breadcrumb }: { user: User; breadcrumb: Breadcrumb[] }) => ({
    user,
    breadcrumb,
  }),
)((props: any) => {
  const { user }: { user: User } = props;

  useEffect(() => {
    if (!user) {
      history.push('/');
      return;
    }
    props.dispatch({
      type: 'breadcrumb/info',
      payload: [{ index: 1, pathname: '/settings', name: '[功能] 设置' }],
    });
  }, [user]);

  return (
    <div className={styles.settings}>
      {user ? (
        <Tabs itemWidth="50%" itemHeight="32px">
          <Tab title="修改资料" name="info">
            <Info />
          </Tab>
          <Tab title="修改介绍" name="profile">
            <Profile />
          </Tab>
          <Tab title="查询积分" name="score">
            <Score />
          </Tab>
        </Tabs>
      ) : (
        <Loading />
      )}
    </div>
  );
});
