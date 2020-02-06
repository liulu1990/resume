<template>
  <footer class="app-bottom-navigator-wrapper app-shell-footer">
    <div class="fill-height box-flex align-center">
      <!-- <a class="flex" v-for="(nav,index) in navigation" :key="nav.icon" @click="curIndex=index" :class="index==curIndex?'on':''">
        <i class="iconfont" :class="curIndex==index?nav.iconon:nav.icon"></i>
        <span>{{nav.name}}</span>
      </a> -->
      <router-link
      class="flex"
      v-for="nav in navigation"
      :key="nav.icon"
      :to="{name: nav.link}"
      active-class="on">
        <i class="iconfont" :class="nav.link==$route.name?nav.iconon:nav.icon"></i>
        <span>{{nav.name}}</span>
      </router-link>
    </div>
  </footer>
</template>
<script>
import bus from '../bus.js'
const navigation = [
  {
    name: '首页',
    icon: 'icon-shouye',
    iconon: 'icon-homefill',
    link: 'home'
  },
  {
    name: '分类',
    icon: 'icon-goods',
    iconon: 'icon-goodsfill',
    link: 'category'
  },
  {
    name: '购物车',
    icon: 'icon-gouwuche',
    iconon: 'icon-cartfill',
    link: 'cart'
  },
  {
    name: '我的',
    icon: 'icon-wode',
    iconon: 'icon-peoplefill',
    link: 'user'
  }
]
export default {
  data () {
    return {
      navigation,
      curIndex: 0,
    }
  }
  
}
</script>
<style scoped>
.app-shell-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.app-bottom-navigator-wrapper {
  height: 52px;
  background: #fff;
  box-shadow: 0 3px 14px 2px rgba(0,0,0,.12);
}
.fill-height {
  height: 100%;
}
.align-center {
  align-items: center;
}
.box-flex {
  display: flex;
}
.flex {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #999;
}
.iconfont {
  font-size: 24px;
}
.flex span {
  font-size: 12px;
}
.on {
  color: #ff6700;
}
</style>
