import styles from './_layout.less';
import Topnav from '@/components/Topnav'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'

export default (props: any) => {
  return (
    <div className={styles.app}>
      <Topnav />
      <div className={styles.breadcrumb}>
        <Breadcrumb />
      </div>
      <main className={styles.main}>
        {props.children}
      </main>
      <Footer />
    </div>
  );
}
