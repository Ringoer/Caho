interface Forum {
  id: number;
  forumName: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  ownerList: string;
  titleList: string;
  creamList: string;
  topList: string;
  gmtCreate: string;
  gmtModified: string;
  beDeleted: boolean;
}
interface Message {
  id: number;
  sendTime: string;
  title: string;
  content: string;
  type: string;
  beRead: boolean;
  fromId: number;
  fromUsername: string;
  fromNickname: string;
  toId: number;
  toUsername: string;
  toNickname: string;
  gmtCreate: string;
  gmtModified: string;
  beDeleted: boolean;
}
interface Reply {
  id: number;
  userId: number;
  userNickname: string;
  userAvatarUrl: string;
  content: string;
  topicId: number;
  beProtected: boolean;
  gmtCreate: string;
  gmtModified: string;
  beDeleted: boolean;
}
interface Topic {
  id: string;
  title: string;
  content: string;
  userId: string;
  userNickname: string;
  userAvatarUrl: string;
  forumId: number;
  top?: boolean;
  tab: string;
  visitCount: number;
  replyCount: number;
  lastReplyAt: string;
  replies?: Reply[];
  beProtected: boolean;
  gmtCreate: string;
  gmtModified: string;
  beDeleted: boolean;
}
interface User {
  id: number;
  username: string;
  password: string;
  roleId: number;
  nickname: string;
  avatarUrl: string;
  signature: string;
  email: string;
  gender: number;
  birthday: string;
  score: number;
  gmtCreate: string;
  gmtModified: string;
  beDeleted: boolean;
}