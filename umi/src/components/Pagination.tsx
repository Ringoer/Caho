import { useEffect, useState } from 'react'
import styles from './Pagination.less'

export default (props: any) => {
  const { selectedPage, action, maxPage } = props
  if (!(typeof parseInt(selectedPage) === 'number' && selectedPage % 1 === 0 && selectedPage > 0)) {
    return (<div>页码错误</div>)
  }
  const [pages, setPages] = useState<number[]>([])
  useEffect(() => {
    const start: number = (selectedPage > 2) ? -2 : ((selectedPage > 1) ? -1 : 0)
    const end = maxPage || -1
    const currentMaxPage = 4 + start + +selectedPage
    const beta = (currentMaxPage - end < 0) ? 0 : currentMaxPage - end
    const tmp: number[] =
      (end < 6 && end !== -1) ?
        [1, 2, 3, 4, 5].slice(0, end) :
        (end === -1 || beta === 0) ?
          [0, 1, 2, 3, 4].map((item: number) => (item + start + +selectedPage)) :
          [0, 1, 2, 3, 4]
            .map((item: number) => (item + start + +selectedPage))
            .map((item: number) => (item - beta))
    setPages(tmp)
  }, [selectedPage, maxPage])
  const [target, setTarget] = useState('')
  const turnTo = (page: string | number) => {
    let target = parseInt(page.toString())
    if (!(typeof target === 'number' && target % 1 === 0 && target > 0 && (!maxPage || target <= maxPage))) {
      return
    }
    action(target.toString())
  }
  return (
    <ul className={styles.pagination + (localStorage.getItem('device') === 'pc' ? '' : ' ' + styles.mobile)}>
      <li>
        <a onClick={() => turnTo(+selectedPage - 1)}>&lt;</a>
      </li>
      {pages.map((item: number) => (
        <li key={item} className={item === +selectedPage ? styles.active : ''}>
          <a onClick={() => turnTo(item)}>{item}</a>
        </li>
      ))}
      <li>
        <a onClick={() => turnTo(+selectedPage + 1)}>&gt;</a>
      </li>
      <li className={styles.turnTo}>
        跳转到
        <input
          type="text"
          onChange={event => { setTarget(event.target.value) }}
          onKeyDown={event => {
            const { key } = event
            if (key === 'Enter') {
              turnTo(target)
            }
          }}
        />
        页
        <button onClick={() => turnTo(target)}>确定</button>
      </li>
    </ul>
  )
}