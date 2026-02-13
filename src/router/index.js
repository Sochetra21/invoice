import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/Layout/Layout.vue'
import CreateInvoice from '@/views/CreateInvoice.vue'
import History from '@/views/History.vue'
import EditInvoice from '@/views/EditInvoice.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout, // The layout
      children: [
        {
          path: '', // Default child route
          component: CreateInvoice,
        },
        {
          path: 'history',
          component: History,
        },
        {
          path: '/edit/:id',
          name: 'EditInvoice',
          component: () => import('../views/EditInvoice.vue'),
        },
        {
          path: '/donation',
          name: 'Donation',
          component: () => import('../views/Donation.vue'),
        },
      ],
    },
  ],
})

export default router
