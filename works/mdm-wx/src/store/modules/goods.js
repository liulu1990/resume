import * as types from '../types'
import { getGoodsInfo, getNoticeList } from 'api'

// state
const state = {
    goods: [],
    noticeList: [],
    cars: []
}

// actions
const actions = {
    async getGoodsList ({ commit, state }, params){
        if (state.goods.length){
            return params.callback && params.callback()
        }
        const res = await getGoodsInfo({ userId: params.userId })
        if (res.code == 1){
            commit({
                type: types.GET_GOODS_LIST,
                data: res.data
            })
            params.callback && params.callback()
        }
    },
    async getNoticeInfo({ commit, state }, params){
        if (state.noticeList.length) return
        const res = await getNoticeList({ userId: params.userId })
        if (res.code == 1){
            commit({
                type: types.GET_NOTICE_LIST,
                data: res.list
            })
        }
    },
    addGoodsCar({ commit, state }, params){
        commit({
            type: types.SET_GOODS_CAR,
            data: params
        })
    },
    clearShopCar({ commit }){
        commit({
            type: types.CLEAR_CAR,
            data: []
        })
    },
    removeGdFromCar({ commit }, params){
        commit({
            type: types.REMOVE_GOODS,
            data: params
        })
    }
}

// mutations
const mutations = {
    [types.GET_GOODS_LIST](state, { data }){
        state.goods = data
    },
    [types.GET_NOTICE_LIST](state, { data }){
        state.noticeList = data
    },
    [types.SET_GOODS_CAR](state, { data }){
        const gd = state.cars.find(item => data.goodsId === item.goodsId)
        if (!gd){ // 没找到
            state.cars.push(data)
        } else {
            gd.num = data.num
        }
    },
    [types.CLEAR_CAR](state, { data }){
        state.cars.forEach(item => item.num = 0)
        state.cars = []
    },
    [types.REMOVE_GOODS](state, { data }){
        let index = state.cars.findIndex(item => data.goodsId == item.goodsId)
        if (index == -1) return
        state.cars.splice(index, 1)
    }
}

// getters
const getters = {
    classifyNum(state){
        let tmp = {}
        state.goods.forEach(cla => {
            let cid = cla.classifyid
            state.cars.forEach(item => {
                if (item.pcid == cid){ // 
                    if (typeof tmp[cid] == 'undefined'){
                        tmp[cid] = 0
                    }
                    tmp[cid] += item.num
                }
            })
        })
        return tmp
    },
    totalNum(state){
        let sum = 0
        state.cars.forEach(item => sum += item.num)
        return sum
    },
    noticeText(state){
        let str = state.noticeList.length ? state.noticeList[0].content : '暂无...'
        return `公告: ${str}`
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
