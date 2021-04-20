import { useEffect, useState } from 'react';
import styles from './album.less';
import request from '@/util/request'
import { connect } from 'umi'
import Loading from '@/components/Loading';

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user, userId } = props
  const [album, setAlbum] = useState<Picture[]>()

  const [_, fresh] = useState(0)

  useEffect(() => {
    if (userId === '0') {
      return
    }
    if (!Number.isInteger(+userId)) {
      return
    }
    request(`/user/${userId}/album`).then(result => {
      if (result.errno !== 0) {
        return
      }
      const { data } = result
      if (data) {
        setAlbum(data)
      } else {
        setAlbum([])
      }
    })
  }, [])
  return (
    <div className={styles.album}>
      {album instanceof Array ? (
        <ul className={styles.pictures}>
          {album.map(picture => (
            <li key={picture.id} className={styles.pictureWrapper}>
              <img src={picture.url} alt="图片" className={styles.picture} />
            </li>
          ))}
        </ul>
      ) : <Loading />}
    </div>
  )
})