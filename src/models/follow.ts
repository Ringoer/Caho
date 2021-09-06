export default {
  namespace: 'follow',
  state: null,
  reducers: {
    info(state: any, { payload }: { payload: any }) {
      return payload;
    },
  },
};
