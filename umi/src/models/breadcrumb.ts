export default {
  namespace: 'breadcrumb',
  state: [{ index: 0, pathname: '/', name: '首页' }],
  reducers: {
    info(state: Breadcrumb[], { payload }: { payload: Breadcrumb[] }) {
      if (state.length < payload[0].index) {
        return state
      }
      return state.slice(0, payload[0].index).concat([...payload]);
    },
  },
};