<template>
  <div class="autherinfo">
    <div class="loading" v-if="isLoading">
      <img src="../assets/Loading.gif" alt="">
    </div>
    <div v-else>
      <div class="authersummay">
        <div class="topbar">作者</div>
        <router-link :to="{name:'user_info',params:{
          name:userinfo.loginname
        }}">
          <img :src="userinfo.avatar_url" alt="" class="pic">
        </router-link>
        <span>{{userinfo.loginname}}</span>
      </div>
      <div class="recent_topics">
        <div class="topbar">作者最近主题</div>
        <ul>
          <li v-for="list in topiclimitby5" :key="list">
            <router-link :to="{name:'article_content',params:{
            id:list.id,
            name:list.author.loginname
          }}">
               {{list.title}}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="recent_replies">
        <div class="topbar">作者最近回复</div>
        <ul>
          <li v-for="list in topreplylimitby5" :key="list">
             <router-link :to="{name:'article_content',params:{
            id:list.id,
            name:list.author.loginname
          }}">
               {{list.title}}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SliderBar',
  data () {
    return {
     isLoading:false,
     userinfo:{}
    }
  },
   methods:{
    getUserInfoData(){
       this.$http.get(`https://cnodejs.org/api/v1/user/${this.$route.params.name}`)
      .then(res=>{
        this.isLoading=false;
        this.userinfo=res.data.data
      })
      .catch(function(err){
        console.log(err)
      })
    }
  },
  computed:{
    topiclimitby5(){
      if(this.userinfo.recent_topics.length){
        return this.userinfo.recent_topics.slice(0,5)
      }
    },
    topreplylimitby5(){
      if(this.userinfo.recent_replies.length){
        return this.userinfo.recent_replies.slice(0,5)
      }
    }
  },
  beforeMount:function(){
    this.isLoading=true;
    this.getUserInfoData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .authersummay, .recent_replies, .recent_topics {
    background-color: #fff;
  }
  .authersummay span{
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
    font-size:16px;
    width: 120px;
  }
  .autherinfo {
    width: 290px;
    font-size: 14px;
    float: right;
    margin-bottom: 20px;
  }
  li{
    padding: 3px 0 ;
  }
  .recent_replies ul, .recent_topics ul {
    margin-top: 0px;
    margin-bottom: 0px;
    list-style: none;
    padding-left: 14px;
  }
  ul a {
    font-size: 12px;
    text-decoration: none;
    color: #778087;
  }
  .topbar {
    padding: 10px;
    background-color: #f6f6f6;
    height: 16px;
    font-size: 12px;
    margin-top: 10px;
  }
  img {
    height: 48px;
    width: 48px;
    border-radius: 3px;
    margin: 10px;
    vertical-align: middle;
  }
  .loginname {
    width: 100px;
    float: right;
    margin-top: 22px;
    margin-right: 159px;
    font-size: 14px;
  }
  .loginname a {
    text-decoration: none;
    color: #778087;
  }
  .authersummay .topbar {
    margin-top: 0px;
  }
</style>
