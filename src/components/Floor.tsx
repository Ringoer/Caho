import { useCallback, useState } from 'react';
import styles from './Floor.less';
import Bubble from './Bubble';
import Button from './Button';
import { connect, Link } from 'umi';
import request from '@/util/request';
import { Swal } from '@/util/swal';
import Label from './Label';

import 'github-markdown-css/github-markdown.css';

interface FloorProps {
  reply: Reply;
  index: number;
  isFollowed: boolean;
  onReply?: Function;
  onReport?: Function;
  ownerId: number;
  user: User;
}

const Floor = connect(({ user }: { user: User }) => ({
  user,
}))((props: FloorProps) => {
  const {
    reply,
    index,
    isFollowed,
    onReply = () => {},
    onReport = () => {},
    ownerId,
    user,
  } = props;
  const [hide, setHide] = useState(false);

  const follow = useCallback(() => {
    Swal.confirm('您真的要关注该用户吗').then((res) => {
      if (!res) {
        return;
      }
      request('/user/follow', {
        method: 'post',
        body: JSON.stringify({
          followId: reply.userId,
        }),
      }).then((res) => {
        if (res.errno === 0) {
          Swal.success('关注成功！');
        } else {
          Swal.error(`关注失败！\n原因：${res.errmsg}`);
        }
      });
    });
  }, [reply]);

  const unfollow = useCallback(
    (followId: number) => {
      Swal.confirm('您真的要取消关注该用户吗？').then((res) => {
        if (!res) {
          return;
        }
        request('/user/unfollow', {
          method: 'post',
          body: JSON.stringify({
            followId,
          }),
        }).then((result) => {
          if (result.errno === 0) {
            Swal.success('取消关注成功！').then(() => {
              location.reload();
            });
          } else {
            Swal.error(`取消关注失败！\n原因：${res.errmsg}`);
          }
        });
      });
    },
    [reply],
  );

  return (
    <div className={styles.floor}>
      <div className={styles.author}>
        <Link to={'/user/' + reply.userId} className={styles.img}>
          <img src={reply.userAvatarUrl} alt="头像" />
        </Link>
        <div className={styles.authorInfo}>
          <Link
            to={'/user/' + reply.userId}
            className={styles.authorNicknameWrapper}
          >
            <span className={styles.authorNickname}>{reply.userNickname}</span>
          </Link>
          <div className={styles.tags}>
            {ownerId === reply.userId ? <Label>楼主</Label> : undefined}
          </div>
          <span className={styles.mobileFloorInfo}>
            {`第${index}楼 ` + reply.gmtCreate}
          </span>
        </div>
        <div className={styles.userAction}>
          <Button
            backgroundColor="white"
            color="black"
            onClick={() => setHide(!hide)}
          >
            {hide ? '展开' : '收起'}
          </Button>
          {!user || user.id === reply.userId ? undefined : isFollowed ? (
            <Button onClick={() => unfollow(reply.userId)}>取关</Button>
          ) : (
            <Button onClick={follow}>关注</Button>
          )}
        </div>
      </div>
      <Bubble>
        <div className={styles.pcFloorInfo}>
          <span className={styles.sign}>{index + '#'}</span>
          <span className={styles.createTime}>发表于：{reply.gmtCreate}</span>
        </div>
        <article
          className={[
            styles.content,
            'markdown-body',
            hide ? styles.hide : null,
          ].join(' ')}
          dangerouslySetInnerHTML={{ __html: reply.content }}
        />
        {user ? (
          <div className={styles.replyAction}>
            {index === 1 ? undefined : (
              <>
                <Button
                  type="plain"
                  onClick={() => onReply(reply.userId, reply.userNickname)}
                >
                  回复
                </Button>
                <Button type="plain" onClick={() => onReport(reply.id)}>
                  举报
                </Button>
              </>
            )}
          </div>
        ) : undefined}
      </Bubble>
    </div>
  );
});

export default Floor;
