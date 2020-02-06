import axios from 'axios'
import qs from 'qs'
import config from 'assets/js/config'
import store from 'store'
import Vue from 'vue'
import { Toast } from 'vant'
Vue.use(Toast)

console.info(config.env)

const instance = axios.create({
    baseURL: config.serverUrl,
    timeout: 4000,
    // withCredentials: true, // 跨域请求时是否需要使用凭证
    paramsSerializer: params => {
        // 序列化 GET 请求参数 -> a: [1, 2] => a=1&a=2
        return qs.stringify(params, { arrayFormat: 'repeat' })
    },
    transformRequest: [data => {
        // 在向服务器发送前修改请求数据，只适用于 POST
        return qs.stringify(data, { arrayFormat: 'repeat' })
    }]
})

let toast = null

// 请求拦截
instance.interceptors.request.use(config => {
    store.dispatch('app/setBtnLoading', !0)
    toast = Toast.loading({ mask: true, message: '加载中...' })
    return config
}, error => Promise.reject(error))

// 相应拦截
instance.interceptors.response.use(response => {
    store.dispatch('app/setBtnLoading', !1)
    toast && toast.clear()
    return response.data
}, error => {
    store.dispatch('app/setBtnLoading', !1)
    console.error(error)
    Toast.fail('数据出错！')
})

export default instance
