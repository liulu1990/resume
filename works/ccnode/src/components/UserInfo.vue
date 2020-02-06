<template>
  <div class="userInfo">
    <div class="loading" v-if="isLoading">
      <img src="../assets/Loading.gif" alt="">
    </div>
    <div v-else class="userInfomation">
      <section>
        <img :src="userinfo.avatar_url" alt="">
        <span>{{userinfo.loginname}}</span>
        <p>{{userinfo.score}}积分</p>
        <p>{{userinfo.create_at | formation}}</p>
      </section>
      <div class="replies">
        <p>回复的主题</p>
        <ul>
          <li v-for="reply in userinfo.recent_replies" :key="reply">
            <router-link :to="{name:'article_content',params:{
            id:reply.id
          }}">
             {{reply.title}}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="topics">
        <p>创建的主题</p>
        <ul>
          <li v-for="reply in userinfo.recent_topics" :key="reply">
          <router-link :to="{name:'article_content',params:{
            id:reply.id
          }}">
               {{reply.title}}
          </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
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
  beforeMount:function(){
    this.isLoading=true;
    this.getUserInfoData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .userInfomation {
    background: white;
    width: 75%;
    margin: 10px auto;
  }
  .userInfomation section {
    padding: 12px;
  }
  .userInfomation img {
    width: 30px;
  }
  .userInfomation li {
    list-style:none;
    border-top: 1px solid #f0f0f0;
  }
  .userInfomation .replies,
  .userInfomation .topics {
    font-size: 0.72rem;
    border-top: 10px #DDDDDD solid;
  }
  .userInfomation > div > p {
    padding: 12px 0 12px 12px;
    background-color: rgba(212, 205, 205, 0.17);
    font-size: 0.75rem;
    margin: 0;
  }
  .userInfomation > div >ul > li {
    padding: 4px 0 4px 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 30px;
    vertical-align: middle;
  }
  .userInfomation > div >ul > li > a {
    color: #094E99;
    text-decoration: none;
    font-size: 16px;
  }
  .userInfomation > div >ul > li > a:hover{
    color: #005580;
    text-decoration: underline;
  }
</style>
