import { defineConfig } from 'umi';

export default defineConfig({
  title: 'Caho - 和谐的ACGN社区',
  links: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{
    exact: false, path: '/', component: '@/pages/_layout', routes: [
      { exact: true, path: '/', redirect: '/forum' },
      {
        exact: false, path: '/forum', component: '@/pages/forum/_layout', routes: [
          { exact: true, path: '/forum', component: '@/pages/forum/index' },
          { exact: true, path: '/forum/:id', component: '@/pages/forum/[id]' },
          { exact: true, path: '/forum/topic/:id', component: '@/pages/forum/topic[id]' },
          { component: '@/pages/404' },
        ]
      },
      {
        exact: false, path: '/user', component: '@/pages/user/_layout', routes: [
          { exact: true, path: '/user/:id', component: '@/pages/user/[id]' },
          { component: '@/pages/404' },
        ]
      },
      { exact: true, path: '/404', component: '@/pages/404' },
      { component: '@/pages/404' },
    ]
  }],
  fastRefresh: {},
});