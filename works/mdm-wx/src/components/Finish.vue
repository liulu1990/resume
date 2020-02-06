<template>
    <div class="finish">
        <div class="panel">
            <h4 class="title">收货方式</h4>
            <van-radio-group class="app-radio" v-model="form.receive" @change="receiveChangeHandler">
                <van-radio v-for="item in receivingMethod" :key="item.value" :name="item.value">
                    <span>{{ item.name }}</span>
                    <i style="color: #999;">{{ item.desc }}</i>
                </van-radio>
            </van-radio-group>
        </div>
        <div class="panel">
            <h4 class="title">收货地址</h4>
            <van-cell :title="form.address" is-link style="padding: 0" @click="addrClickHandler" />
        </div>
        <div class="panel">
            <h4 class="title">联系人信息</h4>
            <van-cell :title="form.contact" is-link style="padding: 0" @click="contactClickHandler" />
        </div>
        <div class="panel">
            <h4 class="title">支付方式</h4>
            <van-radio-group class="app-radio" v-model="form.payMethod">
                <van-radio v-for="item in payMethod" :key="item.value" :name="item.value">
                    <span>{{ item.name }}</span>
                    <i style="color: #999;">{{ item.desc }}</i></van-radio>
            </van-radio-group>
        </div>
        <div class="panel">
            <h4 class="title">订单详情</h4>
            <div class="gd-list">
                <ul>
                    <li v-for="item in cars" :key="item.goodsId">
                        <h5>{{ item.name }}</h5>
                        <em>x{{ item.num }}</em>
                        <span>¥{{ item.presentPrice }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div style="height: 44px;"></div>
        <div class="submit-bar">
           <div class="left">
               <span class="sf"><i>实付：</i>¥ {{ sfPrice }}</span>
               <span class="yf">应付：<del>¥ {{ yfPrice }}</del></span>
           </div>
           <van-button type="primary" :loading="btnLoading" @click="saveOrder">提交订单</van-button>
       </div>
        <van-popup class="addr-panel" :overlay="false" v-model="isShowAddressPanel" position="bottom">
            <van-nav-bar  title="选择收货地址" left-text="返回" left-arrow
                @click-left="addrClickHandler">
            </van-nav-bar>
            <div class="list">
                <van-radio-group v-if="form.receive == 'self_lifting'" class="app-radio" v-model="form.address" @change="addrClickHandler">
                    <van-radio v-for="(item, key) in selfAddressedAddress" :key="key" :name="item.address">{{ item.address }}</van-radio>
                </van-radio-group>
                <van-radio-group v-else class="app-radio" v-model="form.address" @change="addrClickHandler">
                    <van-radio v-for="(item, key) in contacts" :key="key" :name="item.address">{{ item.address }}</van-radio>
                </van-radio-group>
            </div>
            <div class="btn-box" v-if="form.receive !== 'self_lifting'">
                <van-button class="btn" type="primary" @click.stop="addContactHandler">添加联系信息</van-button>
            </div>
        </van-popup>
        <van-popup class="addr-panel" :overlay="false" v-model="isShowContactPanel" position="bottom">
            <van-nav-bar  title="选择联系人" left-text="返回" left-arrow
                @click-left="contactClickHandler">
            </van-nav-bar>
            <div class="list">
                <van-radio-group class="app-radio" v-model="form.contact" @change="contactClickHandler">
                    <van-radio v-for="(item, key) in contacts" :key="key" 
                        :name="`姓名: ${item.name}　　电话: ${item.phone}`">
                        {{ `姓名: ${item.name}　　电话: ${item.phone}` }}
                    </van-radio>
                </van-radio-group>
            </div>
            <div class="btn-box">
                <van-button class="btn" type="primary" @click.stop="addContactHandler">添加联系信息</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Radio, RadioGroup, Cell, CellGroup, Popup, NavBar, Button, Toast } from 'vant'
import { getConfirmInfo, saveOrderRecord } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'finish',
    data(){
        return {
            form: {
                receive: '',
                address: '',
                contact: '',
                payMethod: ''
            },
            isShowAddressPanel: false,
            isShowContactPanel: false,
            receivingMethod: [], // 收获方式
            payMethod: [], // 支付方式
            selfAddressedAddress: [], // 自提点儿地址
            contacts: [] // 联系人信息
        }
    },
    computed: {
        ...mapState('app', ['userInfo', 'btnLoading']),
        ...mapState('goods', ['cars']),
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
        ...mapActions('goods', ['clearShopCar']),
        async getOrderInfo(callback){
            const res = await getConfirmInfo({ userId: this.userInfo.userId })
            if (res.code == 1){
                this.receivingMethod = res.receivingMethod || []
                this.payMethod = res.payMethod || []
                this.selfAddressedAddress = res.selfAddressedAddress || []
                this.contacts = res.contacts || []
                callback && callback()
            }
        },
        async saveOrder(){
            const cars = JSON.stringify(this.cars.map(item => ({
                goodsId: item.goodsId,
                name: item.name,
                presentPrice: item.presentPrice,
                originalPrice: item.originalPrice,
                num: item.num
            })))
            const res = await saveOrderRecord({
                openId: this.userInfo.openId,
                userId: this.userInfo.userId,
                ...this.form,
                goodsList: cars,
                orderCurrentSum: this.sfPrice,
                orderOriginalSum: this.yfPrice,
            })
            if (res.code == 1){
                if (this.form.payMethod !== 'wechat_pay'){ // 不是微信支付
                    Toast.success('支付成功')
                    // 清空购物车
                    this.clearShopCar()
                    setTimeout(() => this.$router.push('/orders'), 500)
                } else {
                    this.wxpayHandler(res.json)
                }
            } else {
                Toast.fail(res.message)
            }
        },
        receiveChangeHandler(val){
            this.form.address = this.findDefaultAddr()
        },
        addrClickHandler(){
            this.isShowAddressPanel = !this.isShowAddressPanel
        },
        contactClickHandler(){
            this.isShowContactPanel = !this.isShowContactPanel
        },
        addContactHandler(){
            this.$router.push('/add_addr')
        },
        findDefaultAddr(){
            if (!this.contacts.length) return '请添加收获地址'
            // console.log(this.form.receive)
            let val
            if (this.form.receive == 'self_lifting'){ // 自提点儿
                val = this.selfAddressedAddress[0] || null
            } else {
                val = this.contacts.find(item => item.isDefault == '1')
            }
            if (!val){ // 没找到，取第一条
                return this.contacts[0].address
            } else {
                return val.address
            }
        },
        findDefaultContact(){
            if (!this.contacts.length) return '请添加联系人信息'
            const val = this.contacts.find(item => item.isDefault == '1')
            if (!val){ // 没找到，取第一条
                return `姓名: ${this.contacts[0].name}　　电话: ${this.contacts[0].phone}`
            } else {
                return `姓名: ${val.name}　　电话: ${val.phone}`
            }
        },
        wxpayHandler(ret){
            if (typeof WeixinJSBridge == 'undefined'){
                if (document.addEventListener){
                    document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
                } else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
                    document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
                }
            } else {
                this.onBridgeReady(ret)
            }
        },
        onBridgeReady(ret){
            let _this = this
            WeixinJSBridge.invoke('getBrandWCPayRequest', ret,
                function(res){
                    // 使用以上方式判断前端返回, 微信团队郑重提示：
                    // res.err_msg将在用户支付成功后返回  ok，但并不保证它绝对可靠
                    if (res.err_msg == 'get_brand_wcpay_request:ok'){
                        Toast.success('支付成功')
                    } else {
                        Toast.fail('支付失败')
                    }
                    setTimeout(() => _this.$router.push('/orders'), 500)
                    // 清空购物车
                    _this.clearShopCar()
                }
            )
        }
    },
    created(){
        this.getOrderInfo(() => {
            this.form.receive = this.receivingMethod[0].value
            this.form.address = this.findDefaultAddr()
            this.form.contact = this.findDefaultContact()
            this.form.payMethod = 'wechat_pay'
        })
    },
    components: {
        VanRadio: Radio,
        VanRadioGroup: RadioGroup,
        VanCell: Cell,
        VanCellGroup: CellGroup,
        VanPopup: Popup,
        VanNavBar: NavBar,
        VanButton: Button
    }
}
</script>

<style>
.finish {
    min-height: 100vh;
    background: #f8f8f8;
    overflow-x: hidden;
}
.panel {
    padding: .2rem;
    margin-bottom: .2rem;
    background: #fff;
}
.panel > .title {
    color: #999;
    font-size: .28rem;
    margin-bottom: .2rem;
}
.finish .app-radio .van-radio {
    min-height: .4rem;
    line-height: .4rem;
    margin-bottom: .15rem;
}
.finish .app-radio .van-radio .van-radio__label {
    font-size: .24rem;
}

/* 订单详情列表 */
.finish .gd-list ul li {
    line-height: .64rem;
    display: flex;
    align-items: center;
}
.finish .gd-list ul li h5 {
    font-size: .28rem;
    flex: 1;
}
.finish .gd-list ul li em {
    display: block;
    min-width: .8rem;
    color: #999;
}
.finish .gd-list ul li span {
    display: block;
    min-width: 1rem;
    text-align: right;
    font-size: .36rem;
    color: rgb(255, 83, 57);
}


/* 弹出面板列表 */
.finish .addr-panel {
    width: 100%;
    height: 100vh;
}
.finish .addr-panel .list .van-radio {
    padding: .2rem;
    min-height: .8rem;
    border-bottom: 1px solid #eee;
    margin-bottom: 0;
}
.finish .btn-box {
    margin: .3rem;
}
.finish .btn {
    width: 100%;
}


/* 底部提交订单 */
.finish .submit-bar {
    height: 44px;
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: rgba(61,61,63,.9);
    display: flex;
    justify-content: space-between;
}
.finish .submit-bar .van-button {
    border-radius: 0;
    background: #38ca73;
    border-color: #38ca73;
    right: -2px;
}
.finish .submit-bar .left {
    line-height: 44px;
    padding-left: .3rem;
}
.finish .submit-bar .yf {
    color: #999;
    margin-left: 10px;
}
.finish .submit-bar .sf {
    font-size: .36rem;
    color: #fff;
}
.finish .submit-bar .sf i {
    font-size: .28rem;
}
</style>