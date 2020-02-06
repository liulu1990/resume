/**
 * @Author: jzy
 * @Date: 2018/1/19
 * @Last Modified by:   jzy
 * @Last Modified time: 2018-08-31 15:45:09
 */
import Vue from 'vue'
import App from './App.vue'
import router from 'routes'
import 'routes/permission'
import store from 'store'
import 'lodash'
import FastClick from 'fastclick'
FastClick.attach(document.body)

Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})