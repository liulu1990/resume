<template>
  <div class="app-shell app-shell-bottom-navigation">
    <div class="app-view-wrapper">
      <div class="container app-view app-view-with-header" style="padding-bottom: 40px;">
        <div class="page-order-view page-wrap pov-with-footer">
          <div class="order-view-block order-view-text order-view-orderInfor">
            <p class="first">订单编号</p>
            <p class="text">{{order.orderNum}}</p>
          </div>
        </div>
        <div class="page-order-view page-wrap pov-with-footer">
          <div class="order-view-block order-view-text order-view-orderInfor">
            <p class="first">收货方式</p>
            <p class="text">{{order.receivingMethod_text}}</p>
        </div>
        </div>
        <div class="page-order-view page-wrap pov-with-footer">
          <div class="order-view-text order-view-orderInfor">
            <p class="first">自提地址</p>
            <p class="text">{{order.goodsAddress}}</p>
          </div>
        </div>
        <div class="page-order-view page-wrap pov-with-footer">
          <div class="order-view-text order-view-orderInfor">
            <p class="first">联系人信息</p>
            <p class="text">联系人: {{order.consigneeName}}</p>
            <p class="text">联系人电话: {{order.consigneePhone}}</p>
          </div>
        </div>
        <div class="page-order-view page-wrap pov-with-footer">
          <div class="order-view-block order-view-text order-view-orderInfor">
            <p class="first">支付方式</p>
            <p class="text">{{order.payMethod_text}}</p>
        </div>
        </div>
        <div class="page-order-view page-wrap pov-with-footer">
          <div class="order-view-text order-view-orderInfor">
            <h3>订单详情</h3>
            <div v-for="good in order.goodsList" :key="good.goodsId">
              <div class="flex">
                <p class="text">{{good.name}}</p>
                <p class="text">￥{{good.presentPrice}}</p>
              </div>
              <p class="item-right"><i>+</i>{{good.number}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="order-view-block order-view-action box-flex">
        <div class="price-box">
          <div class="item-box-bottom">
            <span class="true">实付:</span>
            <strong>¥{{order.presentPriceAll}}</strong>
            <span>应付:</span>
            <del>¥{{order.originalPriceAll}}</del>
          </div>
          <a v-if="order.status == 'pending_pay' && order.payMethod == 'wechat_pay'" :loading="btnLoading" @click="saveOrder" class="pd-pay">支付</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Order from '../api/order'
import { detailOrder, saveOrderRecord } from 'api'
import { mapState, mapActions } from 'vuex'
import { Toast } from 'vant'

export default {
  name: 'order-view',
  data() {
    return {
      order: {},
      id: this.$route.params.id,
    }
  },
  computed: {
    ...mapState('app', ['userInfo', 'btnLoading']),
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const res = await detailOrder({ userId: this.userInfo.userId, id: this.id });
      if (res.code === 1) {
        this.order = res.order;
      }
    },
    async saveOrder(){
        const res = await saveOrderRecord({
            openId: this.userInfo.openId,
            userId: this.userInfo.userId,
            orderNum: this.order.orderNum,
            orderCurrentSum: this.order.presentPriceAll
        })
        if (res.code == 1){
            this.wxpayHandler(res.json)
        } else {
            Toast.fail(res.message)
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
          }
      )
    }
  }
}
</script>

<style>
.app-shell {
  width: 100%;
  background: #fff;
  overflow-x: hidden;
}
.page-order-view p.first,h3{
  color:#999;
  font-size:.3rem;
  line-height: .3rem;
}
.page-order-view p.text{
  padding-left:.2rem;
}
.page-order-view {
  text-align: left;
  background: #f5f5f5;
  font-size: .24rem;
  position: relative;
}
.page-order-view.pov-with-footer {
  padding-bottom: .16rem;
}
.page-order-view .order-view-num {
  position: relative;
}
.page-order-view .order-view-block {
  padding: .26rem .2rem;
  background: #fff;
  display: flex;
  justify-content: space-between;
}
.page-order-view .order-view-num .order-view-info-text {
  line-height: 1.5em;
  flex: 1 0 auto;
}
.page-order-view .order-view-status {
  border-bottom: 1px solid #f6f6f6;
  margin-bottom: 0;
}
.item-right{
  text-align: right;
}
.item-right i{
    display: inline-block;
    transform: rotate(45deg);
}
.page-wrap .order-view-text{
   padding: .26rem .2rem;
   background: #fff;
}
.page-order-view .order-view-text .flex{
  display: flex;
  justify-content: space-between;
}
.page-order-view .order-view-text p,h3 {
  line-height: 0.55rem;
}
.order-view-action {
  background: #505050;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  margin-bottom: 0;
  z-index: 1000;
}
.order-view-action .price-box {
  font-size: 13px;
  color: #999;
  width: 100%;
  text-align: left;
  height:.9rem;
  line-height: .9rem;
  padding-left:.3rem;
  display: flex;
  justify-content: space-between;
}
.order-view-action .price-box span.true{
  color: #fff;
  font-size: .3rem;
}
.order-view-action .price-box strong {
  font-size: .35rem;
  color: #fff;
  margin-right: .4em;
}
.order-view-action .disable {
  background: #f4f4f4;
  border: 1px solid #501d1d;
}
.order-view-action .black {
  color: #333;
}
a.pd-pay{
  display: block;
  color:#fff;
  font-size:.28rem;
  padding:0 .3rem;
  background:#38cb72;
}
</style>
