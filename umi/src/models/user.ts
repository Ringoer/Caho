const defaultUser: User = {
  avatar: "",
  beDeleted: false,
  birthday: "",
  email: "",
  gender: 0,
  gmtCreate: "",
  gmtModified: "",
  id: 0,
  nickname: "",
  password: "",
  roleId: 0,
  signature: "",
  username: "",
}

export default {
  namespace: 'user',
  state: {},
  reducers: {
    info(state: any, { payload }: { payload: any }) {
      return payload;
    },
  },
};