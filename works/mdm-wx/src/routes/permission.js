import router from 'routes'
import store from 'store'
import Vue from 'vue'
import { Dialog } from 'vant'
Vue.use(Dialog)

// 切换路由组件的转场方式
const changeRouterDirection = (to, from) => {
    let dir = 'fade'
    // 浏览器首次加载
    if (!from.name && from.path === '/'){
        return store.dispatch('app/setRouterDirection', '')
    }
    if (typeof to.meta.index == 'undefined'){
        return store.dispatch('app/setRouterDirection', 'fade')
    }
    // 如果 to 索引大于 from 索引, 判断为前进状态, 反之则为后退状态
    if (typeof from.meta.index != 'undefined'){
        dir = (to.meta.index > from.meta.index) ? 'forward' : 'back'
    }
    store.dispatch('app/setRouterDirection', dir)
}

router.beforeEach((to, from, next) => {
    // 开启路由组件加载 loading
    store.dispatch('app/setUpdateLoading', !0)
    // 切换路由转场方向
    changeRouterDirection(to, from)
    // 创建 router-key
    store.dispatch('app/setRouterKey')
    // 判断页面数据是否变动
    if (!store.state.app.isLeaveRemind){
        next()
    } else {
        // 未保存数据提醒
        Dialog.alert({ message: '您有未保存的数据，确认离开此页面吗?' })
            .then(() => next())
            .catch(() => next(false))
    }
})

router.afterEach(to => {
    // 切换网页 title
    document.title = to.meta.title
    // 关闭路由组件加载 loading
    store.dispatch('app/setUpdateLoading', !1)
    // 设置离开提醒为 false
    store.dispatch('app/setLeaveRemind', !1)
})
