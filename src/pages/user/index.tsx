import { useEffect, useState } from 'react';
import styles from './index.less';
import request from '@/util/request';
import { connect, Link } from 'umi';
import Section from '@/components/Section';
import Loading from '@/components/Loading';
import Note from '@/components/Note';
import { changeTime } from '@/util/time';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';

const PER_PAGE = 10;

export default connect(({ user }: { user: User }) => ({ user }))(
  (props: any) => {
    const { user, userId } = props;
    const [forums, setForums] = useState<Forum[]>();
    const [collectedTopics, setCollectedTopics] = useState<Topic[]>();
    const [topics, setTopics] = useState<Topic[]>();
    const [replyTo, setReplyTo] = useState<Topic[]>();
    const [selectedPage, setPage] = useState('1');

    useEffect(() => {
      if (userId === '0' || !Number.isInteger(+userId)) {
        setForums([]);
        setTopics([]);
        setReplyTo([]);
      }
      request(`/forum/collect?userId=${userId}`).then((result) => {
        if (result.errno !== 0) {
          setForums([]);
          return;
        }
        const { data } = result;
        if (!data) {
          setForums([]);
        } else {
          setForums(data);
        }
      });
      request(`/topic/latest?userId=${userId}`).then((result) => {
        if (result.errno !== 0) {
          setTopics([]);
          return;
        }
        const { data } = result;
        if (!data) {
          setTopics([]);
        } else {
          setTopics(data);
        }
      });
      request(`/topic/reply/latest?userId=${userId}`).then((result) => {
        if (result.errno !== 0) {
          setReplyTo([]);
          return;
        }
        const { data } = result;
        if (!data) {
          setReplyTo([]);
        } else {
          setReplyTo(data);
        }
      });
      request(`/topic/collected?userId=${userId}`).then((result) => {
        if (result.errno !== 0) {
          setCollectedTopics([]);
          return;
        }
        const { data } = result;
        if (!data) {
          setCollectedTopics([]);
        } else {
          setCollectedTopics(data);
        }
      });
    }, []);

    const [_, fresh] = useState(0);
    const [clientWidth, setClientWidth] = useState(document.body.clientWidth);

    useEffect(() => {
      fresh(Math.random());
    }, [clientWidth]);

    window.onresize = () => {
      setClientWidth(document.body.clientWidth);
    };

    return (
      <div className={styles.profile}>
        {forums && collectedTopics && topics && replyTo ? (
          <div className={styles.home}>
            <div className={styles.first}>
              <Section title="关注版块">
                <ul className={styles.forums}>
                  {forums.length === 0 ? (
                    <li>暂无关注版块</li>
                  ) : (
                    forums.map((forum) => (
                      <li className={styles.forum} key={forum.id}>
                        <Link to={`/forum/${forum.id}`}>
                          <span>{forum.forumName}&nbsp;&nbsp;</span>
                          <span className={styles.exp}>
                            {forum.exp || 0}&nbsp;经验&nbsp;&nbsp;
                          </span>
                          <span className={styles.level}>
                            {parseInt(((forum.exp || 0) / 100 + 1).toString())}
                            &nbsp;级
                          </span>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </Section>
            </div>
            <div className={styles.second}>
              <Section color="#FFCF4B" title="最近发表的帖子">
                {topics.length === 0 ? (
                  '暂无更多'
                ) : (
                  <ul>
                    {topics.map((topic) => (
                      <li key={topic.id} className={styles.topicWrapper}>
                        <Link to={`/forum/topic/${topic.id}`}>
                          <Note>
                            <div className={styles.topicInfo}>
                              <span className={styles.title}>
                                {topic.title}
                              </span>
                              <span className={styles.lastReplyAt}>
                                {changeTime(topic.lastReplyAt)}
                              </span>
                            </div>
                          </Note>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
              <Section color="#FC83A3" title="最近回复的帖子">
                {replyTo.length === 0 ? (
                  '暂无更多'
                ) : (
                  <ul>
                    {replyTo.map((topic) => (
                      <li key={topic.id} className={styles.topicWrapper}>
                        <Link to={`/forum/topic/${topic.id}`}>
                          <Note>
                            <div className={styles.topicInfo}>
                              <span className={styles.title}>
                                {topic.title}
                              </span>
                              <span className={styles.lastReplyAt}>
                                {changeTime(topic.lastReplyAt)}
                              </span>
                            </div>
                          </Note>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </div>
            <div className={styles.third} key={_}>
              <Section color="#F69143" title="最近收藏的帖子">
                {collectedTopics.length === 0 ? (
                  '暂无更多'
                ) : (
                  <>
                    {clientWidth > 500 ? (
                      <Table
                        columns={[
                          { title: '标题', key: 'title' },
                          { title: '作者', key: 'author', width: 120 },
                          ...(user && user.id === +userId
                            ? [
                                {
                                  title: '更新状态',
                                  key: 'status',
                                  width: 120,
                                },
                                {
                                  title: '最后更新时间',
                                  key: 'modifiedAt',
                                  width: 180,
                                },
                              ]
                            : []),
                        ]}
                        data={collectedTopics
                          .slice(
                            PER_PAGE * (+selectedPage - 1),
                            PER_PAGE * +selectedPage,
                          )
                          .map((topic) => {
                            const {
                              id,
                              title,
                              userId,
                              userNickname,
                              gmtCreate,
                              lastReplyAt,
                            } = topic;
                            return {
                              id,
                              title: (
                                <Link to={`/forum/topic/${id}`}>
                                  <span>{title}</span>
                                </Link>
                              ),
                              author: (
                                <Link to={`/user/${userId}`}>
                                  <span>{userNickname}</span>
                                </Link>
                              ),
                              status:
                                new Date(gmtCreate) >= new Date(lastReplyAt) ? (
                                  <div style={{ padding: 8 }}>无更新</div>
                                ) : (
                                  <Link to={`/forum/topic/${id}`}>
                                    查看更新
                                  </Link>
                                ),
                              modifiedAt: (
                                <div style={{ padding: 8 }}>
                                  {lastReplyAt
                                    .slice(0, '0000-00-00T00:00:00'.length)
                                    .replace('T', ' ')}
                                </div>
                              ),
                            };
                          })}
                      />
                    ) : (
                      <ul>
                        {collectedTopics.map((topic) => (
                          <li key={topic.id} className={styles.topicWrapper}>
                            <Link to={`/forum/topic/${topic.id}`}>
                              <Note>
                                <div className={styles.topicInfo}>
                                  <span className={styles.title}>
                                    {topic.title}
                                  </span>
                                  <span className={styles.lastReplyAt}>
                                    {changeTime(topic.lastReplyAt)}
                                  </span>
                                </div>
                              </Note>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Pagination
                      selectedPage={selectedPage}
                      count={collectedTopics.length}
                      action={(target: string) => setPage(target)}
                      perPage={PER_PAGE}
                    />
                  </>
                )}
              </Section>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    );
  },
);
