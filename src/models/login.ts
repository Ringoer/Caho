export default {
  namespace: 'login',
  state: null,
  reducers: {
    info(state: any, { payload }: { payload: any }) {
      if (state !== payload) {
        return payload;
      } else {
        return state
      }
    },
  },
};