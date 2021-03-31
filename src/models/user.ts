const defaultUser: User = {
  id: 0,
  username: "",
  password: "",
  roleId: 0,
  nickname: "",
  avatarUrl: "",
  signature: "",
  email: "",
  gender: 0,
  birthday: "",
  score: 0,
  gmtCreate: "",
  gmtModified: "",
  beDeleted: false,
}

export default {
  namespace: 'user',
  state: null,
  reducers: {
    info(state: any, { payload }: { payload: any }) {
      return payload;
    },
  },
};