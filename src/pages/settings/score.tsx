import styles from './score.less'
import ImageUploader from "@/components/ImageUploader"
import Note from "@/components/Note"
import { connect } from 'umi'
import { Swal } from '@/util/swal'
import request from '@/util/request'
import Pagination from '@/components/Pagination'
import { useEffect, useState } from 'react'
import Loading from '@/components/Loading'

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user } = props

  const [selectedPage, setPage] = useState('1')
  const [logs, setLogs] = useState<Score[]>()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user) {
      return
    }
    request(`/score/log?page=${selectedPage}`)
      .then(result => {
        const { data }: { data: { logs: Score[], logsCount: number } } = result
        if (!data)
          if (result.errno !== 0 || !data) {
            setLogs([])
            setCount(0)
            return
          }
        const { logs, logsCount } = data
        setLogs(logs || [])
        setCount(logsCount || 0)
      })
  }, [user, selectedPage])

  return (
    logs instanceof Array ? (
      <>
        <p>当前积分：{user.score}</p>
        {
          logs.length !== 0 ? (
            <>
              <table className={styles.scoreTable}>
                <thead>
                  <tr>
                    <td>日期</td>
                    <td>时间</td>
                    <td>操作</td>
                    <td>数量</td>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => {
                    // const t = new Date(log.gmtCreate)
                    const t = new Date(new Date(log.gmtCreate).getTime() + 8 * 1000 * 60 * 60).toISOString()
                    return (
                      (
                        <tr key={log.id}>
                          <td>{t.substr(0, 10)}</td>
                          <td>{t.substr(11, 8)}</td>
                          <td>{log.action}</td>
                          <td>{log.point}</td>
                        </tr>
                      )
                    )
                  })}
                </tbody>
              </table>
              <Pagination selectedPage={selectedPage} count={count} action={(target: string) => setPage(target)} />
            </>
          ) : (
            <p>暂无更多</p>
          )
        }
      </>
    ) : <Loading />
  )
})