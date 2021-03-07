import styles from './_layout.less';
import Topnav from '@/components/Topnav'
import Footer from '@/components/Footer'

export default (props: any) => {
  if (document.body.clientWidth > 500) {
    localStorage.setItem('device', 'pc')
  } else {
    localStorage.setItem('device', 'mobile')
  }
  return (
    <div className={styles.app + (localStorage.getItem('device') === 'pc' ? '' : ' ' + styles.mobile)}>
      <Topnav></Topnav>
      <main className={styles.main}>
        {props.children}
      </main>
      <Footer></Footer>
    </div>
  );
}
