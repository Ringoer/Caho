import { useEffect, useRef, useState } from 'react';
import styles from './Editor.less'
import ReactMarkdown from 'react-markdown';
import Button from './Button'
import Tabs from './Tabs'
import Tab from './Tab'

export default (props: any) => {
  const { disabled, description, hasTitle, onSubmit } = props
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [_, fresh] = useState(0)
  const textarea = useRef<HTMLTextAreaElement>(null)
  useEffect(() => fresh(Math.random()), [])
  return (
    <div className={styles.editor}>
      <p className={styles.description}>{description}</p>
      {hasTitle ? (
        <div className={styles.title}>
          <p>标题</p>
          <input type="text" onChange={(event) => setTitle(event.target.value)} />
        </div>
      ) : undefined}
      <p>正文</p>
      <Tabs onChange={() => fresh(Math.random())}>
        <Tab title="编辑" name="edit">
          <textarea
            className={styles.textarea}
            name="textarea"
            id="textarea"
            defaultValue={text}
            onChange={(event) => setText(event.target.value)}
            ref={textarea}
          />
        </Tab>
        <Tab title="预览" name="preview">
          <div className={styles.md}>
            <ReactMarkdown children={text.split('\n').join('\n\n')} />
          </div>
        </Tab>
      </Tabs>
      <div className={styles.action}>
        <Button
          backgroundColor="white"
          color="black"
          onClick={() => {
            setText('')
            if (!textarea.current) {
              return
            }
            textarea.current.value = ''
          }}
        >重置</Button>
        <Button onClick={() => {
          if (disabled) {
            console.error('您在当前环境下没有权限进行编辑')
            return
          } else if (!(onSubmit instanceof Function)) {
            console.error('传入的提交函数非法')
            return
          }
          onSubmit(text, title)
        }}>提交</Button>
      </div>
      {disabled ? (
        <div className={styles.forbidden}>
          您在当前环境下没有权限进行编辑
        </div>
      ) : undefined}
    </div>
  )
}