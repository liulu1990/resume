<template>
  <div class="header">
    <router-link :to="{name:'postlist'}">
      <img src="../assets/cnodejs_light.svg" alt="">
    </router-link>
    <ul>
      <li><a href="#">首页</a></li>
      <li><a href="#">新手入门</a></li>
      <li><a href="#">API</a></li>
      <li><a href="#">关于</a></li>
      <li><a href="#">注册</a></li>
      <li><a href="#">登录</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
     
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header{
    height: 50px;
    background: #444;
  }
  img{
    width: 120px;
    margin-left: 50px;
    margin-top: 10px;
  }
  ul{
    list-style: none;
    float: right;
    margin: 4px;
  }
  li{
    display: inline-block;
    padding: 10px 15px;
  }
  a{
    text-decoration: none;
    text-shadow: none;
    color: #ccc;
    font-size:12px;
  }
</style>
