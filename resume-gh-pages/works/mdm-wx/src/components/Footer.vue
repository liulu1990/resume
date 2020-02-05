<template>
    <van-tabbar :value="activeIndex" :z-index="9">
        <van-tabbar-item icon="home" to="/home">首页</van-tabbar-item>
        <van-tabbar-item icon="cart" :info="showNum" to="/car">购物车</van-tabbar-item>
        <van-tabbar-item icon="pending-orders" to="/orders">订单</van-tabbar-item>
        <van-tabbar-item icon="contact" to="/my">我的</van-tabbar-item>
    </van-tabbar>
</template>

<script>
import { mapGetters } from 'vuex'
import { Tabbar, TabbarItem } from 'vant'

export default {
    name: 'app-footer',
    data (){
        return {}
    },
    computed: {
        ...mapGetters('goods', ['totalNum']),
        showNum(){
            return this.totalNum > 0 ? this.totalNum : null
        },
        activeIndex(){
            return this.$route.meta.index
        }
    },
    components: {
        VanTabbar: Tabbar,
        VanTabbarItem: TabbarItem
    }
}
</script>

<style>
</style>