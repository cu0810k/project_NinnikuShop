import { createRouter, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/',
    name: 'FrontBoard',
    component: () => import('../views/FrontBoard.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: {
          title: 'ninniku shop'
        }
      },
      {
        path: 'products',
        component: () => import('../views/ProductsView.vue')
      },
      {
        path: 'product/:id',
        component: () => import('../views/ProductView.vue')
      },
      {
        path: 'order/:id',
        component: () => import('../views/OrderView.vue')
      },
      {
        path: 'faq',
        component: () => import('../views/AboutView.vue')
      },
      {
        path: 'wishList',
        component: () => import('../views/WishList.vue')
      },
      {
        path: 'cart',
        component: () => import('../views/CartView.vue')
      },
      {
        path: 'checkout',
        component: () => import('../views/CheckOutView.vue')
      },
      {
        path: 'demand',
        component: () => import('../views/DemandView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
