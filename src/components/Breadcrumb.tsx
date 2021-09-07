import { useEffect } from 'react';
import { connect, Link } from 'umi';
import styles from './Breadcrumb.less';

const BreadCrumb = connect(({ breadcrumb }: { breadcrumb: Breadcrumb[] }) => ({
  breadcrumb,
}))((props: any) => {
  const { breadcrumb }: { breadcrumb: Breadcrumb[] } = props;
  useEffect(() => {
    console.log(breadcrumb);
  }, []);
  return (
    <ul className={styles.breadcrumb}>
      <li className={styles.breadcrumbItem}>
        <a href="/">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-home"></use>
          </svg>
        </a>
      </li>
      {breadcrumb.map((item) => (
        <li className={styles.breadcrumbItem} key={item.index}>
          <span className={styles.separator}>/</span>
          <Link to={item.pathname}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
});

export default BreadCrumb;
