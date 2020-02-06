<template>
  <div class="app-shell">
    <div class="page-order-list app-view app-view-with-header app-view-with-footer">
        <ol class="tab">
          <li
            v-for="list in types"
            :key="list.type"
            :class="{active:type==list.type}"
            @click="changeTab(list.type)">
            <a>{{list.name}}</a>
          </li>
        </ol>
        <div class="page-con">
          <div v-for="list in types" :key="list.type">
              <div v-show="type==list.type" class="page-con-items">
                <div v-if="orderList&&orderList.length>0" class="container">
                  <div class="order-list">
                    <ol>
                      <li
                        v-for="order in orderList"
                        :key="order.orderId"
                        @click.stop="toView(order)">
                        <div class="order-item">
                          <div class="item-box-top">
                            <div class="top-left">
                              <p class="order-data">
                                <strong>订单状态</strong>
                              </p>
                              <p class="order-num">
                                <strong>订单编号：</strong>
                                <span>{{order.orderNum}}</span>
                              </p>
                            </div>
                            <div class="top-right">{{order.status_text}}</div>
                          </div>
                          <div class="clearfix"
                           v-for="goods in calculate(order)"
                           :key="goods.GoodsId">
                            <div class="item-box-center ui-flex align-center">
                              <span class="flex name">{{goods.name}}</span>
                              <!-- <span class="flex">{{order.name}}</span> -->
                            </div>
                            <div class="item-box-center item-right">
                              <span class="flex"><i>+</i>{{goods.number}}</span>
                              <span class="flex"><del>¥{{goods.originalPrice}}</del></span>
                              <span class="flex last">¥{{goods.presentPrice}}</span>
                            </div>
                          </div>
                          <div class="item-box-bottom">
                            <span>共计{{order.numtotal}}件商品</span>
                            <span>应付</span>
                            <del>¥{{order.originalPriceAll}}</del>
                            <span>实付</span>
                            <strong>¥{{order.presentPriceAll}}</strong>
                          </div>
                        </div>
                        <div class="item-box-btn pending_pay text-right" style="height: 0; padding: 0;" v-if="order.status==='pending_pay'"></div>
                        <div class="item-box-btn pending_pay" v-else>
                          <p>收货地址:<span>{{order.goodsAddress}}</span></p>
                          <p>联系电话:<span>{{order.consigneePhone}}</span></p>
                        </div>
                      </li>
                    </ol>
                  </div> 
                </div>
                <div v-if="orderList&&orderList.length==0" class="container">
                  <div class="empty">无订单</div>
                </div>
              </div>
          </div>
          <div class="iphone">
            <img src="../assets/img/iphone.png" alt="客服电话" @click="model">
          </div>
          <div class="overlay">
            <div class="modal">
              <h2>联系电话</h2>
              <a href="tel:17843122163"><p>17843122163</p></a>
            </div>
          </div>
        </div>
      </div>
   </div>  
</template>

<script>
import Order from '../api/order'
import { searchOrder } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'order',
  components: {
    Order
  },
  data() {
    return {
      originalData: [],
      orderList: [],
      type: 1,
      types: [{
        type: 1,
        name: '全部'
      }, {
        type: 2,
        name: '待付款'
      }, {
        type: 3,
        name: '待收货'
      }],
      transitionName: 'page-left'
    }
  },
  computed: {
    ...mapState('app', ['userInfo']),
    typeName() {
      switch (this.type) {
        case 1:
          return '全部'
        case 2:
          return '待付款'
        case 3:
          return '待收货'
      }
    },
  },
  created() {
    this.getList()
  },
  methods: {
    model (){
      var pic = document.getElementsByClassName('iphone')[0],
      modal = document.getElementsByClassName('modal')[0],
			overlay = document.getElementsByClassName('overlay')[0];
		  pic.addEventListener('click',function(e){
        e.stopPropagation();
        overlay.setAttribute('style','display:block');
		  });
		  overlay.addEventListener('click',function(e){
			  overlay.setAttribute('style','display:none');
      });
      modal.addEventListener('click',function(e){
			e.stopPropagation();
       if(e.target.classList.contains('close') || e.target.classList.contains('cancel')){
          overlaytel.setAttribute('style','display:none');
        }
      });
    },
    calculate(order) {
      var tota = 0;
      var total = 0;
      var numtotal = 0;
      if(!order.goodsList){
        return;
      }
      order.goodsList.forEach(function (item) {
        tota += item.originalPrice * item.number;
        total += item.presentPrice * item.number;
        numtotal += Number(item.number);
      });
      // console.log(numtotal);
      order.opTotal = tota.toFixed(2);
      order.ppTotal = total.toFixed(2);
      order.numtotal = numtotal;
      return order.goodsList;
    },

    getNewData() {
      var obj = {};
      obj = this.originalData;
      return obj;
    },

    filterList(status) {
      status = status.split(',');
      let dataList = this.getNewData().filter((item) => {
        // console.log(status.indexOf(item.status));
        return status.indexOf(item.status) >= 0;
      })
      // console.log(dataList)
      return dataList
    },
    async getList() {
      const res = await searchOrder({ userId: this.userInfo.userId })
      if (res.code == 1) {
        this.originalData = res.orderList;
        this.orderList = res.orderList;
      }
    },
    changeTab(type) {
      this.transitionName = type > this.type ? 'page-left' : 'page-right'
      // console.log(type)
      this.type = type;
      switch (type) {
        //待付款
        case 2:
          this.orderList = this.filterList('pending_pay');
          break;
        //待收货
        case 3:
          this.orderList = this.filterList('paid,shipped');
          break;
        //全部
        default:
          this.orderList = this.getNewData();
        break;
      }
    },
    toView(order) {
      this.$router.push(`/order_view/${order.orderId}`)
    }
  }
}
</script>

<style scoped>
.app-shell {
  width: 100%;
  height:100%;
  background: #fff;
  padding-bottom: 1rem;
 }
.clearfix:after{
    display: block;
    clear:both;
    content:'';
}
.text-right p{
  text-align: right;
  color:rgb(255, 83, 57);
}
.page-order-list {
  height: 100%;
}
.page-order-list .tab {
  display:flex;
  border-bottom: 1px solid #ececec;
  background: #fff;
}
.page-order-list .tab li {
  display: block;
  width: 33.33%;
  text-align: center;
}
.page-order-list .tab li a {
  display: inline-block;
  padding: 0 .1rem;
  line-height: .6rem;
  font-size: .32rem;
  padding:.1rem 0;
}
.page-order-list .tab .active a {
  width:1rem;
  color: #ff6700;
  border-bottom: 1px solid #ff6700;
}
.page-order-list .page-con {
  position: relative;
  /* height: 100%; */
  /* overflow: hidden;
  overflow-y: auto; */
}
.page-order-list .page-con-items {
  background: #fff;
  /* transition: transform .4s cubic-bezier(.55,0,.1,1); */
}
.page-order-list .container {
  padding-bottom:1rem;
  color: rgba(60,60,60,.87);
}
.page-order-list .container li {
  border-bottom: .2rem solid #ececec;
  padding: 0 .32rem;
  font-size: .24rem;
  display: block;
}
.page-order-list .container .item-box-top {
  border-bottom: 1px solid #ececec;
  display: flex;
  justify-content: space-between;
  padding: .3rem 0 .2rem;
}
/* .page-order-list .container .item-box-top .top-left {
  
} */
.page-order-list .container .item-box-top .top-left .order-data {
  font-size: .3rem;
  margin-bottom: .06rem;
}
.page-order-list .container strong {
  font-weight: 400;
}
.page-order-list .container .item-box-top .top-left .order-num {
  color: #999;
}
.page-order-list .container .item-box-top .top-right {
  color: #ff5722;
  font-size: .3rem;
}
.page-order-list .container .item-box-center {
  
  /* text-align: left; */
  float: left;
}
.page-order-list .container .item-box-center del{
  color:#999;
}
.page-order-list .container .item-right{
    float: right;
}
.page-order-list .container .item-right span{
    padding-left:.1rem;
}
.item-right i{
    display: inline-block;
    transform: rotate(45deg);
}
.page-order-list .container .item-box-center img {
  width: 1rem;
  height: 1rem;
  margin-right: .1rem;
  display: block;
}
.page-order-list .container .item-box-center span {
    display: inline-block;
    font-size:.24rem;
    padding:.2rem .1rem;
}
.page-order-list .container .item-box-center span.name{
  position: relative;
  top:.1rem;
}
.page-order-list .container .item-box-center span.last{
  color:rgb(255, 83, 57);
  font-size:.36rem;
}
.page-order-list .container .item-box-bottom {
  padding: .2rem 0;
  text-align: right;
  border-top: 1px solid #ececec;
  border-bottom: 1px solid #ececec;
  margin-bottom:.25rem;
}
.page-order-list .container .item-box-bottom span {
  margin-left: .2rem;
  font-size:.28rem;
}
.page-order-list .container .item-box-bottom strong {
  font-size:.36rem;
  color:rgb(255, 83, 57);
  position: relative;
  top:.025rem;
}
.page-order-list .container .item-box-bottom del{
  color:#999;
}
.page-order-list .container .item-box-btn {
  padding-bottom: .26rem;
  text-align: left;
}
.page-order-list .container .item-box-btn p{
  line-height:.5rem;
}
.page-order-list .container .item-box-btn .btn {
  display: inline-block;
  width: auto;
  height: auto;
  font-size: .28rem;
  padding: .14rem 10px.2rem;
  border-radius: 2px;
  margin-left: .2rem;
  line-height: normal;
  border-radius:5px;
}
.page-order-list .empty {
  font-size: .3rem;
  text-align: center;
  /* background: url("../assets/img/Loading.gif") 50% 0 no-repeat; */
  background-size: 2rem 2rem;
  padding-top: 2.5rem;
  color: #999;
  margin: .8rem 1rem 0;
  display: box;
}
.btn-bordered.btn-gray {
  color: #999;
  border: 1px solid #999;
}
.btn-bordered {
  color: #ff6700;
  background: transparent;
  border: 1px solid #ff6700;
}
.page-order-list .iphone {
  display: block;
  width:.75rem;
  height:.75rem;
  position: fixed;
  bottom: 1.3rem;
  right: .32rem;
}
.page-order-list .iphone > img {
  width: 100%;
  height: 100%;
}
.page-order-list .overlay,.overlaytel {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width:  100%;
  background: rgba(217, 217, 217, 0.3);
  z-index: 99;
}
.page-order-list .overlay .modal,.modal-number {
  width:50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 6px;
  background-color: #fff;
}
.page-order-list .overlay .modal>h2 {
  border-bottom: 1px solid #ccc;
  line-height: 2;
  padding-left: .8rem;
  color:#666666;
  font-weight:bold;
  font-size:0.3rem;
  background: url("../assets/img/number.png") 10px 6px no-repeat;
  background-size: 0.5rem 0.5rem;

}
.page-order-list .overlay .modal p {
  padding:.4rem;
  text-align: center;
}
.page-order-list .overlaytel .modal-number{
  width:60%;
  text-align: center;
}
.page-order-list .overlaytel .modal-number>h2{
  background: none;
  padding:.4rem .2rem;
  border-bottom: 1px solid #ccc;
}
.page-order-list .overlaytel .modal-number>h2 span{
  font-size:0.3rem;
  font-weight:bold;
  color:#000;
}
.page-order-list .overlaytel .modal-number span.btn{
  line-height: 2.2;
  cursor: pointer;
  display: inline-block;  
  font-size:0.25rem;
}
.page-order-list .overlaytel .modal-number span.close{
  padding-left:.4rem;
}
.page-order-list .overlaytel .modal-number span.cancel{
  padding-right:.4rem;
}
</style>

