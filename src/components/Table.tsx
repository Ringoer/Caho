import styles from './Table.less';

interface TableProps {
  columns: {
    title: string | React.ReactElement;
    key: string;
    width?: number;
  }[];
  data: Record<string, { id: React.Key } & any>[];
}

const Table = (props: TableProps) => {
  const { columns, data } = props;
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map(({ title, key, width }) => (
            <th key={key} style={width ? { width } : {}}>
              {title}
            </th>
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
