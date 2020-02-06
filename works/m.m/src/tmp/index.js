import MiHome from './MiHome.vue'
import MiCart from './MiCart.vue'
import MiCategory from './MiCategory.vue'
import MiUser from './MiUser.vue'
export default [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'home',
    component: MiHome,
    meta: {
      index: 0
    }
  },
  {
    path: '/category',
    name: 'category',
    component: MiCategory,
    meta: {
      index: 1
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: MiCart,
    meta: {
      index: 2
    }
  },
  {
    path: '/user',
    name: 'user',
    component: MiUser,
    meta: {
      index: 3
    }
  }
]
