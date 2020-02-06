import Vue from 'vue'
import Vuex from 'vuex'
import fetch from '@/api/fetch.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    viewLoading: false,
    transitionName: 'page-left',
    userInfo: null
  },
  getters: {
    isLogin: state => {
      return !!state.userInfo
    }
  },
  mutations: {
    setViewLoading (state, value) {
      state.viewLoading = value
    },
    setTransitionName (state, value) {
      state.transitionName = value
    },
    setUserInfo (state, value) {
      state.userInfo = value
    }
  },
  actions: {
    getUserInfo (context) {
      fetch('userInfo').then(res => {
        context.commit('setUserInfo', res.data.user)
      })
    }
  },
  modules: {
  }
})
