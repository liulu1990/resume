<template>
  <div class="postList">
    <div class="loading" v-if="isLoading">
      <img src="../assets/Loading.gif" alt="">
    </div>
    <div v-else>
      <ul>
        <li v-for="item in items" :key="item">
           <router-link :to="{name:'article_content',params:{
             id:item.id,
            name:item.author.loginname
        }}">
          <img :src="item.author.avatar_url" alt="">
           </router-link>
          <span class="cout">
            <span class="reply_count">{{item.reply_count}}</span>
            <span class="line">/</span>
            <span class="visit_count">{{item.visit_count}}</span>
          </span>
          <span :class="[{put_good:(item.good==true),put_top:(item.top==true),topic_tab:(item.good!=true&&item.top!=true)}]">
            <span>{{item | tabformation}}</span>
          </span>
          <router-link :to="{name:'article_content',params:{
            id:item.id,
            name:item.author.loginname
          }}">
             <span class="tit">{{item.title}}</span>
          </router-link>
          <span class="time">{{item.create_at | formation}}</span>
        </li>
        <li>
          <!-- 分页 -->
          <Pagination @handle="renderlist"></Pagination>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Pagination from './Pagination'
export default {
  name: 'PostList',
  data () {
    return {
     isLoading:false,
     items:[],
     postPage:1
    }
  },
  components:{
    Pagination
  },
  methods:{
    getData(){
      this.$http.get('https://cnodejs.org/api/v1/topics',{
        params:{
          page:this.postPage,
          limit:20
        }
      })
      .then(res=>{
        this.isLoading=false;
        this.items=res.data.data
      })
      .catch(function(err){
        console.log(err)
      })
    },
    renderlist(value){
      this.postPage=value;
      this.getData()
      // alert(value)
    }

  },
  beforeMount:function(){
    this.isLoading=true;
    this.getData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .postList{
    background: #fff;
  }

  img{
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }
  .cout{
    width: 70px;
    display: inline-block;
    text-align: center;
  }
  .cout span{
   vertical-align: middle;
  }
  .cout .line{
    margin: 0 -3px;
    color: #333;
    font-size:12px;
  }
  .cout .reply_count{
    color: #9e78c0;
  }
  .cout .visit_count{
    color: #b4b4b4;
    font-size:12px;
  }
  .tit{
    display: inline-block;
    color:#333;
    font-size:16px;
    width: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: middle;
  }
  .tit:hover{
    cursor: pointer;
    text-decoration: underline;
  }
  .tit:visited{
    color: #888;
  }
  .time{
    color:#778087;
    font-size:12px;
    white-space: nowrap;
    float: right;
    padding-top:8px;
  }
  li{
    border-bottom:1px solid #f0f0f0;
    padding: 10px;
  }
  .put_good, .put_top{
    background: #80bd01;
    padding: 2px 4px;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -o-border-radius: 3px;
    color: #fff;
    font-size: 12px;
    display: inline-block;
    vertical-align: middle;
  }
  .topic_tab{
    background-color: #e5e5e5;
    color: #999;
    padding: 2px 4px;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -o-border-radius: 3px;
    font-size: 12px;
    display: inline-block;
    vertical-align: middle;
  }
</style>
