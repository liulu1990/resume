<template>
    <div class="shop-car">
       <div class="topper">
           <h5>已选商品</h5>
           <span @click.stop="clearShopCar">
               <van-icon name="delete" /> 清空
            </span>
       </div>
       <div class="gd-list">
           <ul>
               <li v-for="item in cars" :key="item.goodsId">
                   <h5 class="name">{{ item.name }}</h5>
                   <div class="price">
                        <span>
                            <i>¥</i><em>{{ item.presentPrice }}</em>
                        </span>
                        <del>¥{{ item.originalPrice }}</del>
                    </div>
                   <div class="number">
                       <input-number v-model="item.num" @change="changeInputNum(item)"></input-number>
                   </div>
               </li>
           </ul>
       </div>
       <div style="height: 95px;"></div>
       <div class="submit-bar">
           <div class="left">
               <span class="sf"><i>实付：</i>¥ {{ sfPrice }}</span>
               <span class="yf">应付：<del>¥ {{ yfPrice }}</del></span>
           </div>
           <van-button type="primary" :disabled="isDisabled" @click.stop="clickHandler">去结算</van-button>
       </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import InputNumber from './InputNumber'
import { Icon, SubmitBar, Button } from 'vant'

export default {
    name: 'shop-car',
    data (){
        return {}
    },
    computed: {
        ...mapState('goods', ['cars']),
        isDisabled(){
            return !this.cars.length
        },
        yfPrice(){
            let sum = 0
            this.cars.forEach(item => sum += item.originalPrice * item.num)
            return sum.toFixed(2)
        },
        sfPrice(){
            let sum = 0
            this.cars.forEach(item => sum += item.presentPrice * item.num)
            return sum.toFixed(2)
        }
    },
    methods: {
        ...mapActions('goods', ['clearShopCar', 'removeGdFromCar']),
        changeInputNum(item){
            if (item.num <= 0){
                this.removeGdFromCar(item)
            }
        },
        clickHandler(){
            this.$router.push('/finish')
        }
    },
    destroyed(){
        // 释放内存空间，防止内存泄漏
    },
    components: {
        InputNumber,
        VanIcon: Icon,
        VanSubmitBar: SubmitBar,
        VanButton: Button
    }
}
</script>

<style>
.shop-car {
    background: #f8f8f8;
    width: 100%;
    min-height: 100vh;
}
.shop-car .topper {
    width: 100%;
    font-size: .32rem;
    line-height: .32rem;
    padding: .2rem .2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f0;
}
.shop-car .topper span {
    font-size: .28rem;
    color: #999;
}
.shop-car .topper .van-icon {
    top: 2px;
}

/* 购物车列表 */
.shop-car .gd-list ul li {
    height: .9rem;
    line-height: .5rem;
    padding: .2rem;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    display: flex;
}
.shop-car .gd-list ul li .name {
    flex: 1;
    font-size: .28rem;
}
.shop-car .gd-list .price {
    padding-right: .2rem;
}
.shop-car .gd-list .price span i {
    font-size: .24rem;
    color: rgb(255, 83, 57);
}
.shop-car .gd-list .price span em {
    font-size: .36rem;
    color: rgb(255, 83, 57);
}
.shop-car .gd-list .price del {
    margin-left: 4px;
    color: #999;
}
.shop-car .gd-list .number {
    text-align: right;
}

/* 底部去结算 */
.shop-car .submit-bar {
    height: 44px;
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 50px;
    z-index: 2;
    background: rgba(61,61,63,.9);
    display: flex;
    justify-content: space-between;
}
.shop-car .submit-bar .van-button {
    border-radius: 0;
    background: #38ca73;
    border-color: #38ca73;
    right: -2px;
}
.shop-car .submit-bar .left {
    line-height: 44px;
    padding-left: .3rem;
}
.shop-car .submit-bar .yf {
    color: #999;
    margin-left: 10px;
}
.shop-car .submit-bar .sf {
    font-size: .36rem;
    color: #fff;
}
.shop-car .submit-bar .sf i {
    font-size: .28rem;
}
</style>