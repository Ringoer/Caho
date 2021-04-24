import { useEffect, useState } from 'react';
import styles from './album.less';
import request from '@/util/request'
import { connect } from 'umi'
import Loading from '@/components/Loading';
import ImageUploader from '@/components/ImageUploader';
import Image from '@/components/Image';
import { Swal } from '@/util/swal';
import Pagination from '@/components/Pagination';

const perPage = 10

export default connect(({ user }: { user: User }) => ({ user }))((props: any) => {
  const { user, userId, onClick } = props
  const [album, setAlbum] = useState<Picture[]>()
  const [pictures, setPictures] = useState<Picture[]>()
  const [selectedPage, setPage] = useState('1')

  function onSubmit(files: FileList) {
    const file = files[0]
    if (file.size > 1024 * 1024) {
      Swal.error('您只能上传不大于 1MB 的图片')
      return
    }
    const body = new FormData()
    body.append('file', file)
    request('/file/image', {
      method: 'post',
      body,
    }, true).then(result => {
      if (result.errno === 0) {
        Swal.success('上传成功！')
          .then(() => {
            request(`/user/${userId}/album`).then(result => {
              if (result.errno !== 0) {
                return
              }
              const { data } = result
              if (data) {
                setAlbum(data.reverse())
              } else {
                setAlbum([])
              }
            })
          })
        return
      } else {
        Swal.error('上传失败！')
        return
      }
    })
  }

  function onDelete(id: number) {
    Swal.confirm('您确定要删除这张图片吗？')
      .then(res => {
        if (!res) {
          return
        }
        request('/file/image', {
          method: 'delete',
          body: JSON.stringify({
            ids: [id]
          })
        }).then(result => {
          if (result.errno !== 0) {
            Swal.error('删除失败！')
            return
          }
          if (!album) {
            return
          }
          const newAlbum = album.filter(item => item.id !== id)
          setAlbum(newAlbum)
          Swal.success('删除成功！')
        })
      })
  }

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
      const { data }: { data: Picture[] } = result
      if (data) {
        setAlbum(data.reverse())
      } else {
        setAlbum([])
      }
    })
  }, [])

  useEffect(() => {
    if (!album) {
      return
    }
    setPictures(album.slice(perPage * (+selectedPage - 1), perPage * +selectedPage))
  }, [album, selectedPage])

  return (
    <div className={styles.album}>
      {album instanceof Array && pictures instanceof Array ? (
        pictures.length === 0 ? (
          <ul className={styles.pictures}>
            <li>暂无更多</li>
          </ul>
        ) : (
          <>
            <ul className={styles.pictures}>
              {pictures.map(picture => (
                <li key={picture.id} className={styles.pictureWrapper}>
                  <button onClick={(event) => {
                    event.preventDefault()
                    onDelete(picture.id)
                  }}>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-delete"></use>
                    </svg>
                  </button>
                  <Image src={picture.url} onClick={onClick} />
                </li>
              ))}
            </ul>
            <br />
            <Pagination
              selectedPage={selectedPage}
              count={album.length}
              action={(target: string) => setPage(target)}
              perPage={perPage}
            />
          </>
        )
      ) : <Loading />}
      {user && user.id === +userId ? (
        <>
          <br />
          <ImageUploader onSubmit={onSubmit} />
        </>
      ) : undefined}
    </div>
  )
})