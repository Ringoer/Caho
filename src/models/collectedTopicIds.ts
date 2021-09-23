export default {
  namespace: 'collectedTopicIds',
  state: [],
  reducers: {
    info(state: any, { payload }: { payload: any }) {
      return payload;
    },
  },
};
