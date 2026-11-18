import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/index/index.vue'),
    meta: { showTabBar: true }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('../pages/category/category.vue'),
    meta: { showTabBar: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../pages/cart/index.vue'),
    meta: { showTabBar: true }
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('../pages/my/index.vue'),
    meta: { showTabBar: true }
  },
  {
    path: '/goods/detail/:id',
    name: 'GoodsDetail',
    component: () => import('../pages/goods/detail.vue'),
    meta: { showTabBar: false }
  },
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: () => import('../pages/order/confirm.vue'),
    meta: { showTabBar: false }
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: () => import('../pages/order/list.vue'),
    meta: { showTabBar: false }
  },
  {
    path: '/address',
    name: 'AddressList',
    component: () => import('../pages/address/index.vue'),
    meta: { showTabBar: false }
  },
  {
    path: '/address/edit',
    name: 'AddressEdit',
    component: () => import('../pages/address/edit.vue'),
    meta: { showTabBar: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});
