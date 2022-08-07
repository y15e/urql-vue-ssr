import {
  createRouter,
  createMemoryHistory,
  createWebHistory
} from 'vue-router'

export default async function (context: any) {
  
  // Routes
  const routes = [
    {
      path: '/',
      component: () => import('./components/Quote.vue')
    }
  ]
  
  // History
  const createHistory = context.ssr ? createMemoryHistory : createWebHistory
  
  // Router
  const router = createRouter({
    history: createHistory(),
    routes
  })
  
  return router
}
