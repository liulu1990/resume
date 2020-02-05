// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
Vue.prototype.$http=axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

//时间过滤
Vue.filter('formation',function(str){
  if(!str) return '';
  var date=new Date(str);
  var time=new Date().getTime()-date.getTime();
  if(time<0){
    return ''
  }else if(time/1000<30){
    return '刚刚'
  }else if(time/1000<60){
    return parseInt(time/1000)+'秒前'
  }else if(time/60000<60){//1000*60
    return parseInt(time/60000)+'分钟前'
  }else if(time/3600000<24){//60000*60
    return parseInt(time/3600000)+'小时前'
  }else if(time/86400000<31){
    return parseInt(time/86400000)+'天前'
  }else if(time/2592000000<12){
    return parseInt(time/2592000000)+'个月前'
  }else{
    return parseInt(time/31104000000)+'年前'
  }
})
//过滤帖子分类
Vue.filter('tabformation',function(item){
  if(item.good==true){
    return '精华'
  }else if(item.top==true){
    return '置顶'
  }else if(item.tab=='ask'){
    return '问答'
  }else if(item.tab=='share'){
    return '分享'
  }else{
    return '招聘'
  }
})