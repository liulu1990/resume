import Vue from 'vue'
import Router from 'vue-router'
import Article from '../components/Article'
import PostList from '../components/PostList'
import UserInfo from '../components/UserInfo'
import SliderBar from '../components/SliderBar'
Vue.use(Router)

export default new Router({
  routes: [
    {
      name:'postlist',
      path:'/',
      components:{
        main:PostList
      }
    },
    {
      name:'article_content',
      path:'/topic/:id&author=:name',
      components:{
        main:Article,
        slidebar:SliderBar
      }
    },
    {
      name:'user_info',
      path:'/userinfo/:name',
      components:{
        main:UserInfo
      }
    }
  ]
})
