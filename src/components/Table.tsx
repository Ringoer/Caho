import styles from './Table.less';

interface TableProps {
  columns: { title: string; key: string }[];
  data: Record<string, { id: any } & any>[];
}

const Table = (props: TableProps) => {
  const { columns, data } = props;
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map(({ title, key }) => (
            <td key={key}>{title}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map(({ key }) => (
              <td key={key}>{row[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
