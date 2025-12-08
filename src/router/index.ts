import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import CustomersPage from '../pages/CustomersPage.vue'
import DealsPage from '../pages/DealsPage.vue'
import PipelineBoardPage from '../pages/PipelineBoardPage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardPage,
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomersPage,
    },
    {
      path: '/customers/:id',
      name: 'customer-details',
      component: () => import('../pages/CustomerDetailsPage.vue'),
      props: true
    },
    {
      path: '/deals',
      name: 'deals',
      component: DealsPage,
    },
    {
      path: '/deals/:id',
      name: 'deal-details',
      component: () => import('../pages/DealDetailsPage.vue'),
      props: true
    },
    {
      path: '/pipeline',
      name: 'pipeline',
      component: PipelineBoardPage,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
