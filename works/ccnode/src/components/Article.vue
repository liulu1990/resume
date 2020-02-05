<template>
  <div id="content">
      <div class="loading" v-if="isLoading">
        <img src="../assets/Loading.gif" alt="">
      </div>  
      <div class="art_all" v-else>
        <div class="top_header">
            <div class="topic_tit">{{ports.title}}</div>
            <div class="change">
                <span>• 发布于 {{ports.create_at | formation}}</span>
                <span>• 作者 {{ports.author.loginname}}</span>
                <span>• {{ports.visit_count}} 次浏览</span>
                <span>• 来自 {{ports.tab | tabformation}}</span>
            </div>
            <div class="inner" v-html="ports.content"></div>
        </div>
        <div id="reply">
          <div class="hd_col">回复</div>
          <div class="reply_hd" v-for="(port,index) in ports.replies" :key="index">
            <router-link :to="{name:'user_info',params:{
              name:port.author.loginname
            }}">
               <img :src="port.author.avatar_url">
            </router-link>
            <div class="flow">
                <span>{{port.author.loginname}}</span>
                <span>{{index+1}}楼</span>
                <span v-if="port.ups.length">
                  {{port.ups.length}}
                </span>
                <span>• {{port.create_at | formation}}</span>
            </div>
            <div class="text" v-html="port.content"></div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Article',
  data () {
    return {
     isLoading:false,
     ports:{}
    }
  },
  methods:{
    getData(){
      this.$http.get('https://cnodejs.org/api/v1/topic/'+this.$route.params.id)
      .then(res=>{
        this.isLoading=false;
        this.ports=res.data.data
      })
      .catch(function(err){
        console.log(err)
      })
    }
  },
  beforeMount:function(){
    this.isLoading=true;
    this.getData()
  },
  watch:{
    '$route'(to,from){
      this.getData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @import url('../assets/markdown-github.css');
  .markdown-text img {
    height: auto;
    max-width: 100%;
    vertical-align: middle;
    border: 0;
    -ms-interpolation-mode: bicubic;
  }
  .markdown-text p {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
    line-height: 2em;
    margin: 1em 0;
  }
  #content{
    margin-right: 305px;
  }
  .top_header{
    background: #fff;
    border-radius:3px 3px 0 0;
  }
  .topic_tit{
    font-size: 22px;
    font-weight: 700;
    padding:10px;
    width: 75%;
    line-height: 130%;
  }
  .change{
    font-size: 12px;
    color: #838383;
    padding:0 10px 10px 10px;
  }
  .inner{
    border-top: 1px solid #e5e5e5;
    padding:10px;
    font-size:15px;
  }
  #reply{
    margin-top:15px; 
  }
  #reply .hd_col{
    padding: 10px;
    background-color: #f6f6f6;
    border-radius: 3px 3px 0 0;
    font-size:14px;
    color: #444;
  }
  .reply_hd{
    background: #fff;
    border-top: 1px solid #f0f0f0;
    padding: 10px;
  }
  .reply_hd img{
    width: 30px;
    height: 30px;
    border-radius: 3px;
    vertical-align: middle;
  }
  #reply .text{
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
    padding-left: 50px;
    color: #333;
    font-size: 15px;
  }
  .flow{
    margin-left: 10px;
    font-size:10px;
    display: inline-block;
  }
  .flow span:nth-child(1){
    color: #666;
  }
  .flow span{
    color: #08c;
  }
</style>
