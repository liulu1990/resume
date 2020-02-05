<template>
    <div class="my-center">
       <div class="topper">
           <span class="img-wrapper">
               <img src="../assets/img/logo.jpg" alt="">
           </span>
           <div class="info">
               <h4>{{ userInfo.name }}</h4>
           </div>
       </div>
       <div class="list">
            <van-cell-group>
                <van-cell title="联系信息管理" icon="contact" to="/contact" is-link />
            </van-cell-group>
       </div>
    </div>
</template>

<script>
import { Cell, CellGroup } from 'vant'
import { mapState, mapActions } from 'vuex'
import { getWxUserInfo } from 'api'

export default {
    name: 'my',
    data (){
        return {}
    },
    computed: {
        ...mapState('app', ['userInfo'])
    },
    methods: {
        ...mapActions('app', ['setUserInfo']),
        async getUserInfo(){
            if (this.userInfo.name != '') return
            const res = await getWxUserInfo({ userId: this.userInfo.userId })
            if (res.code == 1){
                this.setUserInfo(res.data)
            }
        }
    },
    created(){
        this.getUserInfo()
    },
    destroyed(){
        // 释放内存空间，防止内存泄漏
    },
    components: {
        VanCellGroup: CellGroup,
        VanCell: Cell
    }
}
</script>

<style scoped>
.my-center {
    background: #f8f8f8;
    width: 100%;
    min-height: 100vh;
}
.my-center .topper {
    width: 100%;
    height: 2rem;
    background: #fff;
    display: flex;
    align-items: center;
}
.my-center .topper .img-wrapper {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    margin-left: .25rem;
    border-radius: 4px;
    overflow: hidden;
}
.my-center .topper .img-wrapper > img {
    display: block;
    max-width: 100%;
}
.my-center .topper .info {
    margin-left: .25rem;
    font-size: .32rem;
}
.my-center .list {
    margin-top: .2rem;
}

</style>