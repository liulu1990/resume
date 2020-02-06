import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import app from './modules/application'
import goods from './modules/goods'

const store = new Vuex.Store({
    modules: {
        app,
        goods
    }
})

export default store