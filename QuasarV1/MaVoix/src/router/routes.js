const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'configure', component: () => import('pages/Configure.vue') },
      { path: 'tabs', component: () => import('pages/Tabs.vue') }
    ]
  },
  {
    path: '/redirect',
    component: () => import('layouts/Redirect.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
