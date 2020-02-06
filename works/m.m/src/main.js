import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import 'nprogress/nprogress.css'
import './assets/css/reset.css'
import './assets/fonts/iconfont.css'
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false })
import fetch from '@/api/fetch.js'
import VueLazyload from 'vue-lazyload'
import mixins from './mixin.js'
Vue.mixin(mixins)
Vue.use(VueLazyload)
Vue.prototype.$fetch = fetch
Vue.prototype.$NProgress = NProgress
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  store.commit('setViewLoading', true)
  NProgress.start()
  if (to.meta.requiresAuth && store.getters.isLogin) {
    next({
      name: 'login',
      query: {redirect: to.fullPath}
    })
  } else {
    next()
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
