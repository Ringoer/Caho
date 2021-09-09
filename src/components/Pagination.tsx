import { useEffect, useState, useMemo } from 'react';
import styles from './Pagination.less';

interface PaginationProps {
  selectedPage?: string | number;
  action?: (page: string) => void;
  count?: number;
  perPage?: number;
}

const fill = [-2, -1, 0, 1, 2];

const Pagination = (props: PaginationProps) => {
  const {
    selectedPage: defaultPage = 1,
    action = () => {},
    count = 0,
    perPage = 10,
  } = props;

  const selectedPage = useMemo(() => +defaultPage, [defaultPage]);

  if (!(selectedPage && selectedPage % 1 === 0 && selectedPage > 0)) {
    return <div>页码错误</div>;
  }
  const [pages, setPages] = useState<number[]>([]);
  const [maxPage, setMaxPage] = useState(0);

  useEffect(() => {
    const maxPage =
      Number.isInteger(+count) && +count > 0
        ? Math.floor((+count + perPage - 1) / perPage)
        : 0;
    setMaxPage(maxPage);
    const indexes = fill
      .map((item) => {
        const ans = selectedPage + item;
        return ans < 1 ? ans + 5 : ans;
      })
      .sort((a, b) => a - b);
    const tmp = indexes
      .reduce((array, index) => {
        if (index > maxPage) {
          if (index > 5) {
            return [...array, index - 5];
          } else {
            return array;
          }
        }
        return [...array, index];
      }, [] as number[])
      .sort((a, b) => a - b);
    setPages(tmp);
  }, [selectedPage, count]);

  const [target, setTarget] = useState('');
  const turnTo = (page: string | number) => {
    const target = parseInt(page.toString());
    if (
      !(
        typeof target === 'number' &&
        target % 1 === 0 &&
        target > 0 &&
        (!maxPage || target <= maxPage)
      )
    ) {
      return;
    }
    action(target.toString());
  };
  return (
    <ul className={styles.pagination}>
      <li>
        <a onClick={() => turnTo(selectedPage - 1)}>&lt;</a>
      </li>
      {pages.map((item: number) => (
        <li key={item} className={item === selectedPage ? styles.active : ''}>
          <a onClick={() => turnTo(item)}>{item}</a>
        </li>
      ))}
      <li>
        <a onClick={() => turnTo(selectedPage + 1)}>&gt;</a>
      </li>
      <li className={styles.turnTo}>
        跳转到
        <input
          type="text"
          onChange={(event) => {
            setTarget(event.target.value);
          }}
          onKeyDown={(event) => {
            const { key } = event;
            if (key === 'Enter') {
              turnTo(target);
            }
          }}
        />
        页<button onClick={() => turnTo(target)}>确定</button>
      </li>
    </ul>
  );
};

export default Pagination;
