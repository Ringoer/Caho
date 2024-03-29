import styles from './Footer.less';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <article className={styles.content}>
        <p>
          开发者 @<a href="https://ringoer.com">Ringoer</a>
        </p>
        <p>
          如有 bug，请发送邮件给
          <a href="mailto:ringoer@qq.com"> Ringoer 的邮箱</a>
        </p>
      </article>
    </footer>
  );
};

export default Footer;
