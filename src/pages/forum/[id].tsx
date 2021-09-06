import { useEffect, useState } from 'react';
import styles from './[id].less';
import request from '@/util/request';
import { connect, history, Link } from 'umi';

import Button from '@/components/Button';
import Note from '@/components/Note';
import Pagination from '@/components/Pagination';
import Loading from '@/components/Loading';
import { changeTime } from '@/util/time';
import Editor from '@/components/Editor';
import { Swal } from '@/util/swal';
import Label from '@/components/Label';
import Album from '../user/album';
import Popup from '@/components/Popup';
import marked from 'marked';

const tabs = ['日常', '文章', '活动', '新闻', '测试', '其它'];

export default connect(
  ({ user, breadcrumb }: { user: User; breadcrumb: Breadcrumb[] }) => ({
    user,
    breadcrumb,
  }),
)((props: any) => {
  const { user } = props;
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsCount, setTopicsCount] = useState(0);
  const [selectedPage, setPage] = useState(
    (history.location.query && history.location.query.page) || 1,
  );
  const [forum, setForum] = useState<Forum>();
  const [collected, setCollected] = useState<boolean>();
  const [sign, setSign] = useState(true);
  const [tab, setTab] = useState(tabs[0]);

  const [hide, setHide] = useState(true);
  const [insertValue, setInsertValue] = useState('');

  function collectForum() {
    if (!forum) {
      return;
    }
    request('/forum/collect', {
      method: 'post',
      body: JSON.stringify({
        id: forum.id,
        collect: !collected,
      }),
    }).then((result) => {
      if (result.errno === 0) {
        Swal.success('关注成功！').then(() => {
          location.reload();
        });
      } else {
        Swal.error(`操作失败，请先登录！`);
      }
    });
  }

  function onSubmit(content: string, title: string) {
    if (!forum) {
      return;
    }
    request('/topic', {
      method: 'post',
      body: JSON.stringify({
        forumId: forum.id,
        title,
        content,
        tab,
      }),
    }).then((result) => {
      if (result.errno === 0) {
        Swal.success('发表主题成功！').then(() => {
          location.reload();
        });
      }
    });
  }

  function onSign() {
    if (!forum || !user) {
      return;
    }
    if (!collected) {
      Swal.info('请先关注本版块');
      return;
    }
    request('/forum/sign', {
      method: 'post',
      body: JSON.stringify({
        id: forum.id,
      }),
    }).then((result) => {
      if (result.errno === 0) {
        Swal.success('签到成功！');
        setSign(true);
      }
    });
  }

  useEffect(() => {
    if (!user) {
      return;
    }
    request(`/forum/collect?userId=${user.id}`).then((result) => {
      if (!forum) {
        return;
      }
      const { data }: { data: Forum[] } = result;
      if (!data) {
        return;
      }
      const collectForum = data.find((item) => item.id === forum.id);
      if (collectForum) {
        setCollected(true);
      } else {
        setCollected(false);
      }
    });
  }, [user, forum]);

  useEffect(() => {
    setPage((history.location.query && history.location.query.page) || 1);
  }, [history.location.query]);

  useEffect(() => {
    request(location.pathname).then((result) => {
      if (result.errno !== 0) {
        history.push('/404');
        return;
      }
      setForum(result.data);
      props.dispatch({
        type: 'breadcrumb/info',
        payload: [
          {
            index: 1,
            pathname: location.pathname,
            name: `[版块] ${result.data.forumName}`,
          },
        ],
      });

      const target = parseInt(selectedPage.toString());
      if (!(typeof target === 'number' && target % 1 === 0 && target > 0)) {
        history.push('?page=1');
      }
      request(`/topic?forumId=${result.data.id}&page=${selectedPage}`).then(
        (result) => {
          const { data } = result;
          if (!data) {
            history.push('/404');
            return;
          }
          const { topics, topicsCount } = data;
          if (!topics || topics.length === 0) {
            history.push('/404');
            return;
          }
          topics.forEach((topic: Topic) => {
            topic.content = marked(topic.content);
            topic.lastReplyAt = changeTime(topic.lastReplyAt);
          });
          setTopics(topics);
          setTopicsCount(+topicsCount);
        },
      );
    });
  }, [selectedPage]);

  useEffect(() => {
    if (!user || !forum) {
      return;
    }
    request(`/forum/sign?id=${forum.id}`).then((result) => {
      if (result.errno === 0) {
        setSign(result.data);
      }
    });
  }, [user, forum]);

  return (
    <div className={styles.container}>
      {forum ? (
        <div className={styles.forumTop}>
          {forum.bannerUrl ? (
            <img
              src={forum.bannerUrl}
              alt="版块背景"
              className={styles.banner}
            />
          ) : undefined}
          <div className={styles.forumInfoWrapper}>
            <div className={styles.forumInfo}>
              <img
                className={styles.avatar}
                src={forum.avatarUrl || ''}
                alt="版块头像"
                onClick={() => {
                  setPage(1);
                }}
              />
              <span className={styles.forumName}>
                {forum.forumName || '版块名称'}
              </span>
              <span className={styles.description}>
                {forum.description || '版块描述'}
              </span>
              <div className={styles.collect}>
                {collected === undefined ? (
                  <Button className={styles.collect}>加载中</Button>
                ) : (
                  <Button className={styles.collect} onClick={collectForum}>
                    {collected ? '取消关注' : '关注'}
                  </Button>
                )}
              </div>
              <div className={styles.sign}>
                {sign ? (
                  <Button
                    backgroundColor="white"
                    color="black"
                    className={styles.sign}
                  >
                    已签到
                  </Button>
                ) : (
                  <Button className={styles.sign} onClick={onSign}>
                    签到
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : undefined}
      {!forum || topics.length === 0 ? (
        <Loading />
      ) : (
        <>
          <div className={styles.topics}>
            {topics.map((topic: Topic) => (
              <div className={styles.noteWrapper} key={topic.id}>
                <Note>
                  <div className={styles.topic}>
                    <Link to={'/user/' + topic.userId} className={styles.img}>
                      <img src={topic.userAvatarUrl} alt="楼主头像" />
                    </Link>
                    <div className={styles.title}>
                      <div className={styles.tags}>
                        {topic.top ? <Label>置顶</Label> : undefined}
                        <Label backgroundColor="#95BE3E">
                          {topic.tab || '其它'}
                        </Label>
                      </div>
                      <Link
                        to={'/forum/topic/' + topic.id}
                        className={styles.link}
                      >
                        {topic.title}
                      </Link>
                    </div>
                    <div
                      className={styles.content}
                      dangerouslySetInnerHTML={{ __html: topic.content }}
                    />
                    <div className={styles.date}>
                      <Link to={'/user/' + topic.userId}>
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-person"></use>
                        </svg>
                        {topic.userNickname}
                      </Link>
                      <span>
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-date"></use>
                        </svg>
                        回复于{topic.lastReplyAt}
                      </span>
                    </div>
                    <div className={styles.comment}>
                      <span>
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-comment"></use>
                        </svg>
                        {topic.replyCount}
                      </span>
                      <span>
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-view"></use>
                        </svg>
                        {topic.visitCount}
                      </span>
                    </div>
                  </div>
                </Note>
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <Pagination
              count={topicsCount}
              selectedPage={selectedPage}
              action={(target: string) => {
                history.push('?page=' + target);
              }}
            />
          </div>
          <br />
          <div className={styles.editorWrapper}>
            <div className={styles.editorTitleWrapper}>
              <span className={styles.editorTitle}>发表新主题</span>
              {user ? (
                <div className={styles.actions}>
                  <div className={styles.action}>
                    <div className={styles.fromAlbum}>
                      <Button onClick={() => setHide(!hide)}>
                        <span>插入图片</span>
                        <Popup hide={hide}>
                          <div
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            <Album
                              userId={user.id}
                              onClick={(src: string) => {
                                setInsertValue(`![图片](${src})`);
                                setHide(true);
                              }}
                            />
                          </div>
                        </Popup>
                      </Button>
                    </div>
                  </div>
                  <div className={styles.action}>
                    <label htmlFor="selectTab">分区</label>
                    <select
                      name="selectTab"
                      id="selectTab"
                      defaultValue={tabs[0]}
                      onChange={(event) => {
                        setTab(event.target.value);
                      }}
                    >
                      {tabs.map((tab) => (
                        <option key={tab} value={tab}>
                          {tab}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : undefined}
            </div>
            <Editor
              disabled={user ? (forum.id === 1 ? true : false) : true}
              hasTitle
              onSubmit={onSubmit}
              insertValue={insertValue}
            />
          </div>
        </>
      )}
    </div>
  );
});
