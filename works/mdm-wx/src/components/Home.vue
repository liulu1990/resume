<template>
    <div class="home">
        <div class="topper">
            <div class="box">
                <span class="img-wrapper">
                    <img class="img" src="../assets/img/logo.jpg">
                </span>
                <div class="cont">
                    <h3 class="store-name">面对面</h3>
                    <van-cell-group :border="false">
                        <van-cell is-link @click="changeNoticeState">
                            <template slot="title">
                                <span class="notice-text text_overflow_cut">{{ noticeText }}</span>
                            </template>
                        </van-cell>
                    </van-cell-group>
                </div>
            </div>
        </div>
        <div class="container">
            <app-scroll ref="scroll-cla" :data="goods" class="classify">
                <template slot-scope="{ list }">
                    <ul>
                        <li v-for="(item, key) in list" :key="key"
                            :class="{ selected: key == curIndex }"
                            @click.stop="classifyClickHandler(key)">
                            <span>{{ item.classifyname }}</span>
                            <i v-if="classifyNum[item.classifyid] > 0">{{ classifyNum[item.classifyid] }}</i>
                        </li>
                    </ul>
                </template>
            </app-scroll>
            <app-scroll ref="scroll-con" :data="goods" class="gdsbox" 
                :listenScroll="true"
                :probe-type="3"
                @scroll="scrollHandler">
                <template slot-scope="{ list }">
                    <dl v-for="item in list" :key="item.classifyid">
                        <h4 class="class-name text_overflow_cut">{{ item.classifyname }}</h4>
                        <ul>
                            <li v-for="val in item.list" :key="val.goodsId" @click.stop="goodsClickHandler(val)">
                                <span class="img-wrapper"><img class="img" :src="val.pic"></span>
                                <section class="wrapper">
                                    <h5 class="name">{{ val.name }}</h5>
                                    <div class="tag">
                                        <van-tag type="primary" v-for="(title, key) in val.label" :key="key">{{ title }}</van-tag>
                                    </div>
                                    <div class="price-num">
                                        <div class="price">
                                            <span>
                                                <i>¥</i><em>{{ val.presentPrice }}</em>
                                            </span>
                                            <del>¥{{ val.originalPrice }}</del>
                                        </div>
                                        <div class="number">
                                            <input-number v-model="val.num" @change="numChangeHandler(val)"></input-number>
                                        </div>
                                    </div>
                                </section>
                            </li>
                        </ul>
                    </dl>
                </template>
            </app-scroll>
        </div>
        <van-popup class="notice-panel" :overlay="false" v-model="isNoticePanel" position="right">
            <van-nav-bar  title="通知公告" left-text="返回" left-arrow
                @click-left="changeNoticeState">
            </van-nav-bar>
            <div class="notice-scroll">
                <van-cell-group>
                    <van-cell v-for="(item, key) in noticeList" :key="key"
                        :title="`${key+1}. ${item.content}`" :value="item.time" />
                </van-cell-group>
            </div>
        </van-popup>
        <van-popup class="detail-panel" :overlay="false" v-model="isGoodsDetail" position="bottom">
            <van-nav-bar  title="商品详情" left-text="返回" left-arrow
                @click-left="changeGoodsDetailState">
            </van-nav-bar>
            <div class="detail-box">
                <div class="img-wrapper">
                    <img class="img" :src="detail.big_pic">
                </div>
                <div>
                    <van-cell-group>
                        <van-cell :title="detail.name" />
                        <van-cell :title="`商品编号: ${detail.goodsNum}`" />
                        <van-cell>
                            <template>
                                <van-tag type="primary" v-for="(title, key) in detail.label" :key="key">{{ title }}</van-tag>
                            </template>
                        </van-cell>
                        <van-cell>
                            <template>
                                <div class="price-num">
                                    <div class="price">
                                        <span>
                                            <i>¥</i><em>{{ detail.presentPrice }}</em>
                                        </span>
                                        <del>¥{{ detail.originalPrice }}</del>
                                    </div>
                                    <div class="number">
                                        <input-number v-model="detail.num" @change="numChangeHandler(detail)"></input-number>
                                    </div>
                                </div>
                            </template>
                        </van-cell>
                    </van-cell-group>
                </div>
                <div class="ql-editor content" v-html="detail.content"></div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import AppScroll from './Scroll'
import InputNumber from './InputNumber'
import { Cell, CellGroup, Tag, Popup, NavBar } from 'vant'
import { getNoticeList, getGoodDetail } from 'api'
import { debounce } from 'assets/js/util'

export default {
    name: 'home',
    data (){
        return {
            isNoticePanel: false, // 是否显示公告
            isGoodsDetail: false, // 是否显示商品详情
            gdsNodeList: null,
            claliList: null,
            curIndex: 0,
            posArr: [],
            detail: {} // 详情数据
        }
    },
    computed: {
        ...mapState('goods', ['goods', 'noticeList']),
        ...mapState('app', ['userInfo']),
        ...mapGetters('goods', ['classifyNum', 'noticeText'])
    },
    methods: {
        ...mapActions('goods', ['getGoodsList', 'addGoodsCar', 'removeGdFromCar', 'getNoticeInfo']),
        initPosition(){
            this.claliList = document.querySelectorAll('.classify li')
            this.gdsNodeList = document.querySelectorAll('.gdsbox dl')
            for (let i = 0; i < this.gdsNodeList.length; i++){
                this.posArr[i] = this.gdsNodeList[i].offsetTop
            }
        },
        changeNoticeState(){
            this.isNoticePanel = !this.isNoticePanel
        },
        changeGoodsDetailState(){
            this.isGoodsDetail = !this.isGoodsDetail
        },
        async goodsClickHandler(item){
            this.changeGoodsDetailState()
            this.detail = item
            if (this.isGoodsDetail && !!this.detail.content) return
            const res = await getGoodDetail({
                userId: this.userInfo.userId,
                id: item.goodsId
            })
            if (res.code == 1){
                this.detail.content = res.data || '暂无数据...'
            } else {
                this.detail.content = '暂无数据...'
            }
        },
        numChangeHandler(item){
            if (item.num <= 0){
                this.removeGdFromCar(item)
            } else {
                this.addGoodsCar(item)
            } 
        },
        classifyClickHandler(index){
            this.curIndex = index
            this.listScroll.scrollToElement(this.gdsNodeList[index], 400)
        },
        scrollHandler(pos){
            const index = this.findScrollIndex(pos)
            if (index < 0) return
            this.curIndex = index
            debounce(this.syncScrollPos, 30)()
        },
        syncScrollPos(){
            let elOffsetTop = this.claliList[this.curIndex].offsetTop
            let st = elOffsetTop - 200 < 0 ? 0 : elOffsetTop - 200
            if (st + this.classScroll.$el.clientHeight >= this.classScroll.$el.querySelector('.scroll-box').offsetHeight) return
            this.classScroll.scrollTo(0, -1 * st , 400)
        },
        findScrollIndex(pos){
            const t = Math.abs(pos.y)
            for (let i = 0; i < this.posArr.length; i++){
                const len1 = this.posArr[i]
                const len2 = this.posArr[i + 1]
                if (!len2 || (t >= len1 && t < len2)) return i
            }
            return -1
        }
    },
    created(){
        this.getGoodsList({
            userId: this.userInfo.userId,
            callback: () => {
                this.$nextTick(() => this.initPosition())
            }
        })
        this.getNoticeInfo({ userId: this.userInfo.userId })
    },
    mounted(){
        this.classScroll = this.$refs['scroll-cla']
        this.listScroll = this.$refs['scroll-con']
    },
    destroyed(){
        // 释放内存空间，防止内存泄漏
        
    },
    components: {
        AppScroll,
        InputNumber,
        VanCell: Cell,
        VanCellGroup: CellGroup,
        VanTag: Tag,
        VanPopup: Popup,
        VanNavBar: NavBar
    }
}
</script>

<style>
/* nav topper */
.home .topper {
    width: 100%;
    height: 2rem;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 2;
    background: url(../assets/img/mdm.jpg) 50% 0 no-repeat;
    background-size: 100% auto;
    overflow: hidden;
}
.home .topper::before {
    content: '';
    width: 100%;
    height: inherit;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;
    filter: blur(3px);
    overflow: hidden;
}
.home .topper > .box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: inherit;
    display: flex;
    align-items: center;
}
.home .topper .img-wrapper {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    margin-left: .25rem;
    border-radius: 4px;
    overflow: hidden;
}
.home .topper .img-wrapper > .img {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
}
.home .topper .cont {
    flex: 1;
}
.home .topper .store-name {
    padding: .15rem 15px 0;
    font-size: .32rem;
    color: #fff;
}
.home .topper .van-cell-group,
.home .topper .van-icon,
.home .topper .van-cell-group .van-cell {
    background: none;
    color: #fff;
}
.home .topper .cont .notice-text {
    display: block;
    width: 4.5rem;
}


/* 通知公告弹出面板 */
.home .notice-panel {
    width: 100%;
    height: 100vh;
}
.home .notice-panel .notice-scroll {
    width: 100%;
    height: calc(100vh - 50px);
    overflow-y: auto;
}


/* 分类 + 商品 列表 */
.home > .container {
    width: 100%;
    height: calc(100vh - 2rem - 50px) !important;
    display: flex;
    flex-direction: row;
    background: #fff;
}

.home .classify {
    width: 1.6rem;
    height: inherit;
    background: #f8f8f8;
}
.home .classify ul li {
    position: relative;
    padding: .25rem .12rem;
}
.home .classify ul li.selected {
    background: #fff;
}
.home .classify ul li > i {
    font-size: .8em;
    padding: 0 .3em;
    min-width: 1.2em;
    line-height: 1.2em;
    position: absolute;
    right: 2px;
    top: 2px;
    border-radius: .6em;
    background-color: #f44;
    color: #fff;
    font-family: Arial;
    text-align: center;
}

.home .gdsbox {
    flex: 1;
    height: inherit;
}
.home .gdsbox .class-name {
    height: .5rem;
    line-height: .5rem;
    padding-left: .15rem;
    background: #f5f5f5;
}
.home .gdsbox ul > li {
    padding: .15rem;
    min-height: 1.8rem;
    display: flex;
}
.home .gdsbox .img-wrapper {
    display: block;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 2px;
    overflow: hidden;
}
.home .gdsbox .img-wrapper > .img {
    display: block;
    width: 1.8rem;
    height: 1.8rem;
}
.home .gdsbox .wrapper {
    position: relative;
    flex: 1;
    padding-left: .15rem;
    padding-bottom: .5rem;
}
.home .gdsbox .wrapper .name {
    font-weight: bold;
    font-size: .3rem;
    line-height: 1.2;
    margin-bottom: 5px;
}
.home .gdsbox .wrapper .van-tag {
    margin: 3px 3px 0 0;
}
.home .price-num {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: .5rem;
    padding-left: .12rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.home .price-num .price span i {
    font-size: .24rem;
    color: rgb(255, 83, 57);
}
.home .price-num .price span em {
    font-size: .36rem;
    color: rgb(255, 83, 57);
}
.home .price-num  .price del {
    font-size :10px;
    color: #999;
}
.home .price-num .number {
    position: absolute;
    right: 0;
    top: 0;
}

/* 商品详情 */
.home .detail-panel {
    width: 100%;
    height: 100vh;
}
.home .detail-panel .detail-box {
    width: 100%;
    height: calc(100vh - 50px);
    overflow-y: auto;
}
.home .detail-panel .img-wrapper > .img {
    display: block;
    max-width: 100%;
}
.home .detail-panel .van-tag {
    margin: 2px 4px 2px 0;
}
.home .detail-panel .price-num {
    position: relative;
    left: auto;
    top: auto;
}
.home .detail-panel .content {
    padding: .1rem .2rem;
}
</style>