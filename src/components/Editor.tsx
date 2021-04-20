import { useRef, useState } from 'react';
import styles from './Editor.less'
import Button from './Button'
import Tabs from './Tabs'
import Tab from './Tab'

import marked from 'marked'
import 'github-markdown-css/github-markdown.css'

export default (props: any) => {
  const { disabled, hasTitle, onSubmit, defaultValue, wordsLimit = 4095 } = props
  const [title, setTitle] = useState('')
  const [text, setText] = useState<string>(defaultValue || '')
  const textarea = useRef<HTMLTextAreaElement>(null)
  return (
    <div className={styles.editor}>
      {hasTitle ? (
        <div className={styles.title}>
          <p>标题</p>
          <input type="text" onChange={(event) => setTitle(event.target.value)} />
        </div>
      ) : undefined}
      <p>
        <span>正文</span>
        &nbsp;
        <span style={{ color: '#acacac' }}>支持Markdown文本</span>
      </p>
      <p>
        <span>您还可以输入&nbsp;{wordsLimit - text.length}&nbsp;字</span>
      </p>
      <Tabs>
        <Tab title="编辑" name="edit">
          <textarea
            className={styles.textarea}
            name="textarea"
            id="textarea"
            defaultValue={disabled ? '' : text}
            onChange={(event) => setText(event.target.value)}
            ref={textarea}
          />
        </Tab>
        <Tab title="预览" name="preview">
          <article
            className={[styles.md, 'markdown-body'].join(' ')}
            dangerouslySetInnerHTML={{ __html: marked(text) }}
          />
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