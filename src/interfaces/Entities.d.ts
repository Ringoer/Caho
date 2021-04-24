interface CollectForum {
  id: number;
  forumId: number;
  userId: number;
  gmtCreate: string;
  gmtModified: string;
  beDeleted: boolean;
}
interface Forum {
  id: number;
  forumName: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  exp?: number;
  ownerList?: number[];
  gmtCreate: string;
  gmtModified: string;
  beDeleted: boolean;
}
interface Message {
  id: number;
  title: string;
  content: string;
  type: string;
  tab: number;
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
interface Picture {
  id: number;
  userId: number;
  url: string;
  gmtCreate: Date;
  gmtModified: Date;
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
interface Score {
  id: number;
  userId: number;
  action: string;
  point: number;
  gmtCreate: Date;
  gmtModified: Date;
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
  forum?: Forum;
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
  score?: number;
  gmtCreate: string;
  gmtModified: string;
  beDeleted: boolean;
}