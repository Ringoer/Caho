import styles from './score.less';
import { connect } from 'umi';
import request from '@/util/request';
import Pagination from '@/components/Pagination';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Table from '@/components/Table';

export default connect(({ user }: { user: User }) => ({ user }))(
  (props: any) => {
    const { user } = props;

    const [selectedPage, setPage] = useState('1');
    const [logs, setLogs] = useState<Score[]>();
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!user) {
        return;
      }
      request(`/score/log?page=${selectedPage}`).then((result) => {
        const { data }: { data: { logs: Score[]; logsCount: number } } = result;
        if (!data)
          if (result.errno !== 0 || !data) {
            setLogs([]);
            setCount(0);
            return;
          }
        const { logs, logsCount } = data;
        setLogs(logs || []);
        setCount(logsCount || 0);
      });
    }, [user, selectedPage]);

    return logs instanceof Array ? (
      <>
        <p>当前积分：{user.score}</p>
        {logs.length !== 0 ? (
          <>
            <Table
              columns={[
                { title: '日期', key: 'date' },
                { title: '时间', key: 'time' },
                { title: '操作', key: 'action' },
                { title: '数量', key: 'point' },
              ]}
              data={logs.map((log) => {
                const t = new Date(
                  new Date(log.gmtCreate).getTime() + 8 * 1000 * 60 * 60,
                ).toISOString();
                const date = t.substr(0, 10),
                  time = t.substr(11, 8);
                const { id, action, point } = log;
                return { id, date, time, action, point };
              })}
            />
            <Pagination
              selectedPage={selectedPage}
              count={count}
              action={(target: string) => setPage(target)}
            />
          </>
        ) : (
          <p>暂无更多</p>
        )}
      </>
    ) : (
      <Loading />
    );
  },
);
