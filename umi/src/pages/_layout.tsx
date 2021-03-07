import styles from './_layout.less';
import Topnav from '@/components/Topnav'
import Footer from '@/components/Footer'

export default (props: any) => {
  return (
    <div className={styles.app}>
      <Topnav></Topnav>
      <main className={styles.main}>
        {props.children}
      </main>
      <Footer></Footer>
    </div>
  );
}
