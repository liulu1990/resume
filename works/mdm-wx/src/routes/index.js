import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 同步加载的组件
import Layout from 'components/Layout'
import Home from 'components/Home'
import ShopCar from 'components/ShopCar'
import Orders from 'components/Orders'
import My from 'components/My'

// 异步加载的组件
const Contact = () => import('components/Contact')
const EditAddr = () => import('components/EditAddr')
const AddAddr = () => import('components/AddAddr')
const Finish = () => import('components/Finish')
const OrderView = () => import('components/OrderView')

export const routerMap = [
    {
        path: '/',
        name: 'layout',
        component: Layout,
        children: [
            {
                path: '/',
                name: 'home',
                meta: { title: '首页', index: 0 }, // index 用来定义当前路由的层级, 由小到大, 由低到高
                component: Home
            },
            {
                path: '/car',
                name: 'car',
                meta: { title: '购物车', index: 1 },
                component: ShopCar
            },
            {
                path: '/orders',
                name: 'order',
                meta: { title: '订单管理', index: 2 },
                component: Orders
            },
            {
                path: '/my',
                name: 'my',
                meta: { title: '个人中心', index: 3 },
                component: My
            }
        ]
    },
    {
        path: '/contact',
        name: 'contact',
        meta: { title: '联系信息管理' },
        component: Contact
    },
    {
        path: '/add_addr',
        name: 'addAddr',
        meta: { title: '添加联系信息' },
        component: AddAddr
    },
    {
        path: '/edit_addr/:id',
        name: 'editAddr',
        meta: { title: '编辑联系信息' },
        component: EditAddr
    },
    {
        path: '/finish',
        name: 'finish',
        meta: { title: '订单确认' },
        component: Finish
    },
    {
        path: '/order_view/:id',
        name: 'order_view',
        meta: { title: '订单详情' },
        component: OrderView
    },
    {
        path: '*', redirect: '/'
    }
]

export default new VueRouter({
    mode: 'history',
    scrollBehavior (to, from, savedPosition){
        if (savedPosition){
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes: routerMap
})