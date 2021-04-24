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
          { exact: true, path: '/forum/all', component: '@/pages/forum/all' },
          { exact: true, path: '/forum/add', component: '@/pages/forum/add' },
          { exact: true, path: '/forum/:id', component: '@/pages/forum/[id]' },
          { exact: true, path: '/forum/topic/:id', component: '@/pages/forum/topic[id]' },
          { component: '@/pages/404' },
        ]
      },
      {
        exact: false, path: '/message', component: '@/pages/message/_layout', routes: [
          { exact: true, path: '/message', component: '@/pages/message/index/_layout' },
          { exact: true, path: '/message/add', component: '@/pages/message/add' },
          { exact: true, path: '/message/view', component: '@/pages/message/view' },
          { component: '@/pages/404' },
        ]
      },
      {
        exact: false, path: '/admin', component: '@/pages/admin/_layout', routes: [
          // { exact: true, path: '/admin/:id', component: '@/pages/admin/[id]' },
          { component: '@/pages/404' },
        ]
      },
      { exact: false, path: '/user/:id', component: '@/pages/user/_layout' },
      { exact: true, path: '/settings', component: '@/pages/settings/_layout' },
      { exact: true, path: '/login', component: '@/pages/action/login' },
      { exact: true, path: '/register', component: '@/pages/action/register' },
      { exact: true, path: '/register/verify', component: '@/pages/action/register.verify' },
      { exact: true, path: '/404', component: '@/pages/404' },
      { component: '@/pages/404' },
    ]
  }],
  fastRefresh: {},
});