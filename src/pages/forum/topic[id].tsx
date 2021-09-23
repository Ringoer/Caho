import { useEffect, useState, useMemo } from 'react';
import styles from './topic[id].less';
import request from '@/util/request';

import Floor from '@/components/Floor';
import Pagination from '@/components/Pagination';
import Loading from '@/components/Loading';
import Editor from '@/components/Editor';
import { connect, history } from 'umi';
import { changeTime } from '@/util/time';
import { Swal } from '@/util/swal';
import Button from '@/components/Button';
import Popup from '@/components/Popup';
import Album from '../user/album';
import marked from 'marked';

const PER_PAGE = 10;

export default connect(
  ({
    user,
    follow,
    collectedTopicIds,
    breadcrumb,
  }: {
    user: User;
    follow: User[];
    collectedTopicIds: number[];
    breadcrumb: Breadcrumb[];
  }) => ({
    user,
    follow,
    collectedTopicIds,
    breadcrumb,
  }),
)((props: any) => {
  const { user, follow, collectedTopicIds } = props;
  const { id: topicId } = props.match.params;
  const follows = useMemo<number[]>(
    () => (follow ? follow.map(({ id }: { id: string }) => id) : undefined),
    [follow],
  );
  const [topic, setTopic] = useState<Topic>();
  const [floors, setFloors] = useState<Reply[]>([]);
  const [selectedPage, setPage] = useState(
    (history.location.query && history.location.query.page) || 1,
  );
  const [defaultValue, setDefaultValue] = useState('');

  const [albumHide, setAlbumHide] = useState(true);
  const [listHide, setListHide] = useState(true);
  const [insertValue, setInsertValue] = useState('');

  const [beCheckedOwner, setBeCheckedOwner] = useState(false);
  const [beReversed, setBeReversed] = useState(false);

  function onReply(userId: number, userNickname: string) {
    setDefaultValue(`[@${userNickname}](/user/${userId}) `);
    scrollTo(0, 99999);
  }

  function onReport(replyId: number) {
    Swal.confirm('您真的要举报这个楼层吗').then((res) => {
      if (!res) {
        return;
      }
      request('/topic/report', {
        method: 'post',
        body: JSON.stringify({
          replyId,
        }),
      }).then((res) => {
        if (res.errno === 0) {
          Swal.success('举报成功').then(() => {
            location.reload();
          });
        } else {
          Swal.error('举报失败');
          console.error(res.errmsg);
        }
      });
    });
  }

  function onCollect() {
    if (!topic) {
      return;
    }
    if (typeof +topicId !== 'number') {
      Swal.error('不可以收藏非本站的帖子！');
      return;
    }

    const collected = !collectedTopicIds.includes(+topicId);
    Swal.confirm(`您确定要${collected ? '' : '取消'}收藏该主题吗？`).then(
      (res) => {
        if (!res) {
          return;
        }
        request('/topic/collect', {
          method: 'post',
          body: JSON.stringify({
            topicId: +topicId,
            collected,
          }),
        }).then((result) => {
          if (result.errno === 0) {
            Swal.success(collected ? '收藏成功！' : '取消收藏成功！').then(() =>
              location.reload(),
            );
          } else {
            Swal.error('收藏失败！');
          }
        });
      },
    );
  }

  function onCheckOwner() {
    if (!topic || !(topic.replies instanceof Array)) {
      return;
    }
    const data: any[] = [];
    data.push(topic);
    data.push(...topic.replies);
    if (beCheckedOwner) {
      setFloors(data);
    } else {
      setFloors(data.filter((floor) => floor.userId === topic.userId));
    }
    setBeCheckedOwner(!beCheckedOwner);
    setBeReversed(false);
  }

  function onReverse() {
    if (!topic || !(topic.replies instanceof Array) || floors.length === 0) {
      return;
    }
    setFloors([floors[0]].concat(floors.slice(1).reverse()));
    setBeReversed(!beReversed);
  }

  function onSubmit(content: string) {
    if (!topic) {
      return;
    }
    request('/topic/reply', {
      method: 'post',
      body: JSON.stringify({
        topicId: topic.id,
        content,
      }),
    }).then((result) => {
      if (result.errno === 0) {
        Swal.success('回复主题成功！').then(() => {
          location.reload();
        });
      } else {
        Swal.error(result.errmsg);
      }
    });
  }

  useEffect(() => {
    request(`/topic/${topicId}`).then((result) => {
      if (result.errno !== 0) {
        history.push('/404');
        return;
      }
      const { data } = result;
      if (!data || !data.forum) {
        history.push('/404');
        return;
      }
      const { forum } = data;
      props.dispatch({
        type: 'breadcrumb/info',
        payload: [
          {
            index: 1,
            pathname: `/forum/${forum.id}`,
            name: `[版块] ${forum.forumName}`,
          },
          {
            index: 2,
            pathname: location.pathname,
            name: `[主题] ${data.title}`,
          },
        ],
      });
      data.content = marked(data.content);
      data.gmtCreate = changeTime(data.gmtCreate);
      data.replies = (data.replies || []).map((reply: Reply) => {
        reply.content = marked(reply.content);
        reply.gmtCreate = changeTime(reply.gmtCreate);
        return reply;
      });
      setTopic(data);
      setFloors([data].concat(data.replies));
      props.dispatch({
        type: 'breadcrumb/info',
        payload: [
          {
            index: 2,
            pathname: location.pathname,
            name: `[主题] ${data.title}`,
          },
        ],
      });
    });
  }, []);

  useEffect(() => {
    if (!topic || !collectedTopicIds.includes(topic.id)) {
      return;
    }
    request('/topic/collected', {
      method: 'put',
      body: JSON.stringify({ topicId: +topicId }),
    });
  }, [collectedTopicIds, topic]);

  return (
    <div className={styles.container}>
      {!topic || (user && !follows) ? (
        <Loading />
      ) : (
        <>
          <div className={styles.content}>
            <div className={styles.listLocation}>
              <div className={styles.listWrapper}>
                <Button
                  className={styles.listEntry}
                  onClick={() => setListHide(!listHide)}
                >
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-list"></use>
                  </svg>
                </Button>
                <div
                  className={[
                    styles.list,
                    listHide ? styles.hide : undefined,
                  ].join(' ')}
                >
                  <ul>
                    <li>
                      <Button onClick={onCollect}>
                        {collectedTopicIds.includes(+topicId)
                          ? '取消收藏'
                          : '收藏主题'}
                      </Button>
                    </li>
                    <li>
                      <Button onClick={onReverse}>
                        {beReversed ? '正' : '倒'}序查看
                      </Button>
                    </li>
                    <li>
                      <Button onClick={onCheckOwner}>
                        {beCheckedOwner ? '查看全部' : '只看楼主'}
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <h1 className={styles.title}>{topic.title}</h1>
            <hr className={styles.separator} />
            {floors.length === 0 ? undefined : (
              <Floor
                reply={floors[0]}
                index={1}
                isFollowed={follows && follows.includes(floors[0].userId)}
                ownerId={floors[0].userId}
              />
            )}
            {floors
              .slice(
                PER_PAGE * (+selectedPage - 1) + 1,
                PER_PAGE * +selectedPage + 1,
              )
              .map((floor: Reply, index: number) => (
                <Floor
                  key={floor.id}
                  reply={floor}
                  index={
                    beReversed
                      ? floors.length -
                        (index + PER_PAGE * +selectedPage - PER_PAGE)
                      : index + PER_PAGE * +selectedPage - PER_PAGE + 2
                  }
                  isFollowed={follows && follows.includes(floor.userId)}
                  onReply={onReply}
                  onReport={onReport}
                  ownerId={floors[0].userId}
                />
              ))}
          </div>
          <Pagination
            selectedPage={+selectedPage}
            count={floors.length}
            action={(target: string) => setPage(target)}
          />
          <br />
          <div className={styles.editorWrapper}>
            <div className={styles.editorTitleWrapper}>
              <span className={styles.editorTitle}>发表新回复</span>
              {user ? (
                <div className={styles.actions}>
                  <div className={styles.action}>
                    <div
                      className={styles.fromAlbum}
                      onClick={() => setAlbumHide(!albumHide)}
                    >
                      <Button>
                        <span>插入图片</span>
                      </Button>
                      <Popup hide={albumHide}>
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          <Album
                            userId={user.id}
                            onClick={(src: string) => {
                              setInsertValue(`![图片](${src})`);
                              setAlbumHide(true);
                            }}
                          />
                        </div>
                      </Popup>
                    </div>
                  </div>
                </div>
              ) : undefined}
            </div>
            <Editor
              disabled={user ? (topic.forumId === 1 ? true : false) : true}
              key={defaultValue}
              defaultValue={defaultValue}
              onSubmit={onSubmit}
              insertValue={insertValue}
            />
          </div>
        </>
      )}
    </div>
  );
});
