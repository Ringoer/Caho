import styles from './ImageUploader.less';
import { useRef, useState } from 'react';
import Image from './Image';
import Button from './Button';
import { Swal } from '@/util/swal';

interface ImageUploaderProps {
  src?: string;
  scale?: number;
  onSubmit?: (fileList: FileList) => void;
}

const formatSize = (size: number) => {
  let ans = size;
  const rate = 1024;
  const suffix = ['B', 'KB', 'MB'];
  for (let i = 0; i < suffix.length; i++) {
    if (ans < rate) {
      return `${ans}${suffix[i]}`;
    }
    ans = ans / rate;
  }
  return `${ans}GB`;
};

const ImageUploader = (props: ImageUploaderProps) => {
  const { src = '', scale = 200, onSubmit = () => {} } = props;

  const image = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState(src);
  return (
    <div className={styles.imageUploader}>
      <input
        type="file"
        name="image"
        id="image"
        ref={image}
        style={{ display: 'none' }}
        onChange={() => {
          if (
            !image.current ||
            !image.current.files ||
            image.current.files.length === 0
          ) {
            return;
          }
          setPreviewUrl(URL.createObjectURL(image.current.files[0]));
        }}
      />
      <div className={styles.action}>
        <Button
          onClick={(event: Event) => {
            event.preventDefault();
            if (!image.current) {
              return;
            }
            image.current.click();
          }}
        >
          选择图片
        </Button>
        <Button
          backgroundColor="#84D65D"
          onClick={(event: Event) => {
            event.preventDefault();
            if (
              !image.current ||
              !image.current.files ||
              image.current.files.length === 0
            ) {
              Swal.error('您尚未选择图片！');
              return;
            }
            onSubmit(image.current.files);
          }}
        >
          上传图片
        </Button>
      </div>
      {image.current && image.current.files && image.current.files[0] ? (
        <p>您选择的图片大小为 {formatSize(image.current.files[0].size)}</p>
      ) : undefined}
      {previewUrl === '' ? undefined : <Image src={previewUrl} scale={scale} />}
    </div>
  );
};

export default ImageUploader;
