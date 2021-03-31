import styles from './_layout.less';
import Topnav from '@/components/Topnav'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import Bottomnav from '@/components/Bottomnav'
import { connect } from 'umi';
import { useEffect } from 'react';

export default connect(({ breadcrumb }: { breadcrumb: Breadcrumb[] }) => ({ breadcrumb }))((props: any) => {
  const { breadcrumb } = props
  useEffect(() => {
    if (breadcrumb.length !== 1) {
      document.title = `${breadcrumb[breadcrumb.length - 1].name} - Caho`
    }
  }, [breadcrumb])
  return (
    <div className={styles.app}>
      <Topnav />
      <div className={styles.breadcrumb}>
        <Breadcrumb />
      </div>
      <main className={styles.main} key={location.pathname}>
        {props.children}
      </main>
      <Footer />
      <Bottomnav />
    </div>
  );
})