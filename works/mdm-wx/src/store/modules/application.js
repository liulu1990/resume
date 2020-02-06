import * as types from '../types'

// state
const state = {
    userInfo: {
        openId: 'oTPru09_maOoMveWeJYIZnfnA9SM',
        userId: '5e307c94182b4113b7f8612dc00bcbf7',
        name: '',
        phone: ''
    },
    direction: '', // 切换路由方向
    updateLoading: false, // 路由切换 loading
    btnLoading: false, // 按钮的加载中状态
    isLeaveRemind: false, // true -> 开启提醒     false -> 关闭提醒
    routerKey: `router-view-${+new Date()}` // 路由容器key，防止缓存
}

// actions
const actions = {
    setUserInfo({ commit }, params){
        commit({
            type: types.SET_USER_INFO,
            data: params
        })
    },
    setRouterDirection ({ commit }, params){
        commit({
            type: types.UPDATE_DIRECTION,
            data: params
        })
    },
    setUpdateLoading ({ commit }, params){
        commit({
            type: types.UPDATE_LOADING,
            data: params
        })
    },
    setBtnLoading ({ commit }, params){
        commit({
            type: types.BUTTON_LOADING,
            data: params
        })
    },
    setLeaveRemind ({ commit }, params){
        commit({
            type: types.LEAVE_REMIND,
            data: params
        })
    },
    setRouterKey ({ commit }){
        commit({
            type: types.ROUTER_KEY,
            data: `router-view-${+new Date()}`
        })
    }
}

// mutations
const mutations = {
    [types.SET_USER_INFO](state, { data }){
        for (let attr in data){
            if (typeof state.userInfo[attr] !== 'undefined'){
                state.userInfo[attr] = data[attr]
            }
        }
    },
    [types.UPDATE_DIRECTION](state, { data }){
        state.direction = data
    },
    [types.UPDATE_LOADING](state, { data }){
        state.updateLoading = data
    },
    [types.BUTTON_LOADING](state, { data }){
        state.btnLoading = data
    },
    [types.LEAVE_REMIND](state, { data }){
        state.isLeaveRemind = data
    },
    [types.ROUTER_KEY](state, { data }){
        state.routerKey = data
    }
}

// getters
const getters = {

}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
