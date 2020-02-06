<template>
  <header class="app-header-wrapper app-shell-header">
    <div class="app-header-left" @click="goback">
      <a class="app-header-item">
        <i class="iconfont icon-fanhui"></i>
      </a>
    </div>
    <div class="app-header-middle">
      <div class="app-header-title">{{title}}</div>
    </div>
    <div class="app-header-right">
      <a class="app-header-item">
        <i v-if="showSearchIcon" class="iconfont icon-sousuo"></i>
      </a>
    </div>
  </header>
</template>
<script>
import bus from '@/bus.js'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    showSearchIcon: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goback () {
      this.$router.go(-1)
      bus.$emit('transitionName', 'page-right')
    }
  }
}
</script>

<style scoped>
.app-shell-header {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
}
.loading {
  box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.12);
}
.app-header-title {
  width: 100%;
  font-size: 18px;
}
.iconfont {
  font-size: 24px;
}
</style>
