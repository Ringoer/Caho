import { useEffect, useRef, useState } from 'react';
import styles from './Tabs.less'
import Tab from './Tab'

export default (props: any) => {
  const { selected, direction = 'row', itemWidth, itemHeight } = props
  const [flag, setFlag] = useState(false)
  const [tabs, setTabs] = useState<any[]>([])
  const [target, setTarget] = useState<string>(selected)
  const li = useRef(null)

  const [_, fresh] = useState(0)

  useEffect(() => {
    let tabs = props.children
    if (!(tabs instanceof Array)) {
      tabs = [tabs]
    }
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i]
      if (!(tab.type === Tab)) {
        console.error('Tabs 的直接子标签必须是 Tab')
        return
      } else if (!tab.props.title) {
        console.error('Tab 标签不能没有 title 属性')
        return
      } else if (!tab.props.name) {
        console.error('Tab 标签不能没有 name 属性')
        return
      }
    }
    if (!flag && !selected) {
      setTarget(tabs[0].props.name)
    }
    setTabs(tabs)
    setFlag(true)
    fresh(Math.random())
  }, [target])

  return (
    <div className={[styles.tabs, direction === 'row' ? styles.row : styles.column].join(' ')}>
      {flag ? (
        <>
          <ul className={styles.menu}>
            {direction === 'row' ? (
              <li className={styles.indicator}
                style={{
                  //@ts-ignore
                  width: li.current ? li.current.offsetWidth : 'auto',
                  //@ts-ignore
                  left: li.current ? li.current.offsetLeft : 'auto'
                }} />
            ) : (
              <li className={styles.indicator}
                style={{
                  //@ts-ignore
                  height: li.current ? li.current.offsetHeight : 'auto',
                  //@ts-ignore
                  top: li.current ? li.current.offsetTop : 'auto'
                }} />
            )}
            {tabs.map((tab: any) => (
              <li
                key={tab.props.name}
                className={styles.menuItem}
                onClick={() => setTarget(tab.props.name)}
                ref={tab.props.name === target ? li : null}
                style={{
                  width: itemWidth ? itemWidth : 'auto',
                  height: itemHeight ? itemHeight : 'auto'
                }}
              >
                {tab.props.title}
              </li>
            ))}
          </ul>
          {tabs.find((tab: any) => tab.props.name === target)}
        </>
      ) : undefined}
    </div>
  )
}