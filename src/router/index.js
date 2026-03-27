import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../views/ToolsView.vue'),
  },
  {
    path: '/tools/:id',
    name: 'ToolPage',
    component: () => import('../views/ToolPageView.vue'),
    props: true,
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('../views/NotesView.vue'),
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/ProjectsView.vue'),
  },
  {
    path: '/github',
    name: 'Github',
    component: () => import('../views/GithubView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
