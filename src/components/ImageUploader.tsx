import styles from './ImageUploader.less';
import { useEffect, useRef, useState } from 'react'

export default (props: any) => {
  const { src, width, height } = props

  const image = useRef<HTMLInputElement>(null)

  const [previewUrl, setPreviewUrl] = useState(src || 'https://ali.ringoer.com/cdn/caho/avatar/default_forum_avatar.png')
  return (
    <div className={styles.wrapper}>
      <label htmlFor="image">版块头像</label>
      <input type="file" name="image" id="image" ref={image} onChange={() => {
        if (!image.current || !image.current.files || image.current.files.length === 0) {
          return
        }
        console.log(image.current.files[0])
        console.log(URL.createObjectURL(image.current.files[0]))
        setPreviewUrl(URL.createObjectURL(image.current.files[0]))
      }} />
      <img src={previewUrl} alt="版块头像预览" style={{ width, height }} />
    </div>
  )
}