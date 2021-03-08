const forums = [
  { id: 1, src: 'http://pic.ringoer.com/64928049_p0.png', name: 'CNODE社区', href: '/forum/1', banner: 'cnode_banner.png' },
  { id: 2, src: 'https://avatars.githubusercontent.com/u/38180330?v=4&s=120', name: '版块名称', href: '#', banner: 'default_banner.jpg' },
  { id: 3, src: 'https://avatars.githubusercontent.com/u/38180330?v=4&s=120', name: '版块名称', href: '#', banner: 'default_banner.jpg' },
  { id: 4, src: 'https://avatars.githubusercontent.com/u/38180330?v=4&s=120', name: '版块名称', href: '#', banner: 'default_banner.jpg' },
]

export default {
  // 支持值为 Object 和 Array
  'GET /api/forums': {
    success: 0,
    data: forums,
    msg: ''
  },
  'GET /api/topmenu': {
    success: 0,
    data: [
      { id: 1, name: 'username', href: '/home' },
      { id: 2, name: '设置', href: '/settings' },
    ],
    msg: ''
  },
  'GET /api/topic/1': {
    success: 0,
    data: forums.find(item => item.id === 1),
    msg: ''
  },
}